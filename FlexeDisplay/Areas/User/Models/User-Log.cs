using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlexeDisplay.Areas.User.Models
{
    public class User_Log
    {
        public int UserId { get; set; }
        public string IPAddress { get; set; }
        public string Username { get; set; }
        public string SessionToken { get; set; }
    }
}