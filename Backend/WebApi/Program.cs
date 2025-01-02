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

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

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
});
string sqsQueueUrl = builder.Configuration["AWS:SqsQueueUrl"];
if (sqsQueueUrl == null)
{
    throw new InvalidOperationException();
}
builder.Services.AddSingleton<SqsService>(sp => new SqsService(sqsQueueUrl));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

var secretKey = builder.Configuration["JWT:Key"];

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey ?? ""));

builder.Services.AddAuthentication(options =>
 {
     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
 }).AddJwtBearer(opt =>
 {
     opt.TokenValidationParameters = new TokenValidationParameters
     {
         ValidateIssuerSigningKey = true,
         ValidateIssuer = false,
         ValidateAudience = false,
         IssuerSigningKey = key
     };
 });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(m => m.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();