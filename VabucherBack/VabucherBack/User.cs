﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VaBucherBack
{
    public class User
    {
        public int Id { get; set; }
        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string CV { get; set; } = string.Empty;
        public int Role { get; set; }
        public string Jobtype { get; set; } = string.Empty;
        public string Domain { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime DateCreation { get; set; }
        public DateTime DateLastConnexion { get; set; }
        public string codeValidation { get; set; } = string.Empty;
        public bool isConfirmed { get; set; } = false;

    }
}