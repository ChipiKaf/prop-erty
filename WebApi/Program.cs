using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApi.Helpers;
using WebApi.DataAccess;
using WebApi.DataAccess.Data;
using WebApi.DataAccess.Interfaces;
using WebApi.DataAccess.Repository;
using Microsoft.AspNetCore.Identity;
using WebApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

// Retrieve the environment variable
var dbPassword = builder.Configuration["DBPassword"];

if (string.IsNullOrEmpty(dbPassword))
{
    throw new InvalidOperationException("Database password is not set in environment variables.");
}

var sqlStringBuilder = new SqlConnectionStringBuilder(builder.Configuration.GetConnectionString("Default"))
{
    Password = dbPassword
};

builder.Services.AddDbContext<ApplicationContext>(options =>
    options.UseSqlServer(sqlStringBuilder.ConnectionString));

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
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

var secretKey = builder.Configuration["AppSettings:Key"];

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey ?? ""));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
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