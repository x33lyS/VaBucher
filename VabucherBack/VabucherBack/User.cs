using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VaBucherBack
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
    }
}
