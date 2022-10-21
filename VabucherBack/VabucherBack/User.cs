using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VaBucherBack
{
    public class User
    {
        public int Id { get; set; }
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string CV { get; set; } = string.Empty;
        public int Role { get; set; }
        public string Search { get; set; } = string.Empty;
    }
}