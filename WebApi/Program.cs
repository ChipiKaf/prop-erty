using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApi.Data;
using WebApi.Helpers;
using WebApi.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

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

builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(sqlStringBuilder.ConnectionString));

builder.Services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

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