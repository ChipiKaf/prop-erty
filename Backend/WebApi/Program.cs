using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApi.Helpers;
using WebApi.DataAccess.Data;
using WebApi.DataAccess.Interfaces;
using WebApi.DataAccess.Repository;
using Microsoft.AspNetCore.Identity;
using WebApi.Models;
using Npgsql;
using WebApi.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Antiforgery;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o =>
{
    o.AddPolicy("AllowSpecificOrigin", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            policy.WithOrigins("https://propert.chipilidev.com")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
    });
});

// Retrieve the environment variable
//var dbPassword = builder.Configuration["DBPassword"];
var dbPassword = builder.Configuration["POSTGRES_DBPassword"];

if (string.IsNullOrEmpty(dbPassword))
{
    throw new InvalidOperationException("Database password is not set in environment variables.");
}
//var sqlStringBuilder = new SqlConnectionStringBuilder(builder.Configuration.GetConnectionString("RDSConnection")) // For SQL Server
var sqlStringBuilder = new NpgsqlConnectionStringBuilder(builder.Configuration.GetConnectionString("RDSConnection"))
{
    Password = dbPassword
};

builder.Services.AddDbContext<ApplicationContext>(options =>
    options.UseNpgsql(sqlStringBuilder.ConnectionString));

builder.Services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

builder.Services
    .AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        // Optionally configure password rules, lockout, etc.
        // options.Password.RequiredLength = 8;
        // options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    })
    .AddEntityFrameworkStores<ApplicationContext>()   // Tells Identity to use your EF Core store
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/api/account/login";
    options.LogoutPath = "/api/account/logout";
    
    // Configure cookie settings for enhanced security
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.Name = "Propert.AuthCookie";
    options.Cookie.Path = "/";
    //options.Cookie.Domain = "propert.chipilidev.com";

    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
    options.SlidingExpiration = true;
    // Prevent MVC Behavior of redirecting on UNAUTHORIZED
    options.Events.OnRedirectToLogin = context =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };

    options.Events.OnValidatePrincipal = async context =>
    {
        // Implement custom validation logic if needed
        await Task.CompletedTask;
    };

    if (builder.Environment.IsDevelopment())
    {
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest; // Allow Http in Dev
        options.Cookie.SameSite = SameSiteMode.Lax;
    }
    else
    {
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.None; // Frontend and Backend are on different subdomains
        options.Cookie.Domain = ".chipilidev.com";
    }
});

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-XSRF-TOKEN"; // Add Antiforgery
});

if (!builder.Environment.IsDevelopment())
{
    builder.Services.AddHsts(o =>
    {
        o.Preload = true;
        o.IncludeSubDomains = true;
        o.MaxAge = TimeSpan.FromDays(365);
        o.ExcludedHosts.Add("propert.chipilidev.com");
    });
}

string sqsQueueUrl = builder.Configuration["AWS:SqsQueueUrl"];
if (sqsQueueUrl == null)
{
    throw new InvalidOperationException();
}
builder.Services.AddSingleton<SqsService>(sp => new SqsService(sqsQueueUrl));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

var secretKey = builder.Configuration["JWT:Key"];

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey ?? ""));

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin"); // Apply CORS policy

// Middleware to set CSP and HSTS in production
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Append("Content-Security-Policy", "default-src 'self';");
        await next();
    });
}

app.UseAuthentication();
app.UseAuthorization();

// Missleware to fetch CSRF token on every request
app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/api/account/antiforgery/token"))
    {
        await next();
        return;
    }

    if (context.User.Identity.IsAuthenticated)
    {
        var tokens = app.Services.GetRequiredService<IAntiforgery>().GetAndStoreTokens(context);
        context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!,
            new CookieOptions
            {
                HttpOnly = false,
                Secure = !builder.Environment.IsDevelopment(),
                SameSite = builder.Environment.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
                Domain = builder.Environment.IsDevelopment() ? null : ".chipilidev.com",
                Path = "/"
            }
            
            );
    }
    await next();
});
app.MapControllers();

app.Run();