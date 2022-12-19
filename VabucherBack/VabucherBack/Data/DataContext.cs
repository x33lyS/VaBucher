using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VabucherBack;

namespace VaBucherBack.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<JobOffer> JobOffers => Set<JobOffer>();
        public DbSet<JobHistory> JobHistories => Set<JobHistory>();
        public DbSet<Function> Functions => Set<Function>();
        public DbSet<JobType> JobTypes => Set<JobType>();
        public DbSet<Search> Searches => Set<Search>();
        public DbSet<Localisation> Localisations => Set<Localisation>();



    }
}
