﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace TicketingSystem.Models
{
    public partial class TicketDBContext : DbContext
    {
        public TicketDBContext()
        {
        }

        public TicketDBContext(DbContextOptions<TicketDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Favorite> Favorites { get; set; } = null!;
        public virtual DbSet<Ticket> Tickets { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=.\\SQLExpress;Database=TicketDB;Trusted_Connection=True;ConnectRetryCount=0;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasKey(e => e.PkId)
                    .HasName("PK__Favorite__40A359C384517DE7");

                entity.Property(e => e.PkId).HasColumnName("pkId");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.UserId)
                    .HasMaxLength(40)
                    .HasColumnName("UserID");

                entity.HasOne(d => d.IdNavigation)
                    .WithMany(p => p.Favorites)
                    .HasForeignKey(d => d.Id)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__Favorites__id__5FB337D6");
            });

            modelBuilder.Entity<Ticket>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.IsFavorited).HasColumnName("isFavorited");

                entity.Property(e => e.IsOpen).HasColumnName("isOpen");

                entity.Property(e => e.OpenedUserId)
                    .HasMaxLength(40)
                    .HasColumnName("openedUserID");

                entity.Property(e => e.ProblemDescription)
                    .HasMaxLength(200)
                    .HasColumnName("problemDescription");

                entity.Property(e => e.ResolvedUserId)
                    .HasMaxLength(40)
                    .HasColumnName("resolvedUserID");

                entity.Property(e => e.Title)
                    .HasMaxLength(40)
                    .HasColumnName("title");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
