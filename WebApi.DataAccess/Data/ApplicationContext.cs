
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApi.Models;

namespace WebApi.DataAccess.Data
{
    public class ApplicationContext: IdentityDbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options): base(options)
        {
            
        }

        // Define DbSet for each entity
        public DbSet<Property> Properties { get; set; }
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Property>().HasData(
                new Property
                {
                    Id = 1,
                    City = "Pretoria",
                    Cost = 1000,
                    Description = "Experience unparalleled luxury with this exquisite penthouse in a prestigious Pretoria estate. This stunning residence offers modern sophistication and timeless charm, making it the perfect retreat for an elevated lifestyle. Nestled in the heart of Pretoria, the estate provides easy access to upscale shopping, fine dining, and reputable schools, all within a serene, secure environment.",
                    Image = "1.jpg",
                    Name = "The Penthouse",
                    Model = "4.glb",
                    Texture = "3.jpg",
                    Type = "Estate"
                },
                new Property
                {
                    Id = 2,
                    City = "Johannesburg",
                    Cost = 1000,
                    Description = "Experience tranquility and modern living in this beautiful sanctuary home townhouse located in the vibrant city of Johannesburg. This residence combines contemporary design with a serene atmosphere, providing the perfect escape from the bustling city life.",
                    Image = "2.jpg",
                    Name = "Sanctuary home",
                    Model = "2.glb",
                    Texture = "2.jpg",
                    Type = "Townhouse"
                },
                new Property
                {
                    Id = 3,
                    City = "Johannesburg",
                    Cost = 2000,
                    Description = "Welcome to this stylish condo in the heart of Johannesburg, offering modern living in a prime urban setting. This well-appointed flat provides a perfect blend of comfort and convenience, ideal for city dwellers seeking a vibrant lifestyle. Located in a desirable neighborhood, the condo offers easy access to Johannesburg's top attractions, shopping centers, dining spots, and cultural landmarks. The building features secure access, ensuring a safe and peaceful living environment.",
                    Image = "3.jpg",
                    Name = "The Condo",
                    Model = "",
                    Texture = "",
                    Type = "Flat"
                },
                new Property
                {
                    Id = 4,
                    City = "Durban",
                    Cost = 1500,
                    Description = "Discover refined living in this elegant townhouse located in the sought-after Craven Hills neighborhood of Durban. This residence offers a harmonious blend of contemporary design and comfort, making it an ideal home for those seeking both style and convenience.",
                    Image = "4.jpg",
                    Name = "Craven hills",
                    Model = "",
                    Texture = "",
                    Type = "Townhouse"
                }

             );
            modelBuilder.Entity<PropertyLikeCount>().HasData(
                new PropertyLikeCount { Id = 1, Count = 0 },
                new PropertyLikeCount { Id = 2, Count = 0 },
                new PropertyLikeCount { Id = 3, Count = 0 },
                new PropertyLikeCount { Id = 4, Count = 0 }
            );
            modelBuilder.Entity<PropertyLike>()
                .HasOne(pl => pl.Property)
                .WithMany(p => p.Likes)
                .HasForeignKey(pl => pl.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PropertyLike>()
                    .HasOne(pl => pl.User)
                    .WithMany(u => u.Likes)
                    .HasForeignKey(pl => pl.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PropertyLikeCount>()
                 .HasOne(plc => plc.Property)
                 .WithOne(p => p.PropertyLikeCount)
                 .HasForeignKey<PropertyLikeCount>(plc => plc.Id)
                 .IsRequired();
        }
    }
}
