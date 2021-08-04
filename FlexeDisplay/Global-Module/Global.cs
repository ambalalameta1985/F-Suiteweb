using FlexeDisplay.Areas.User.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Web;

namespace FlexeDisplay.GlobalModule
{
    public class Global
    {
        #region EXCEL LOCATION

        // excel file location object
        public static string scheduledReportsPath = HttpContext.Current.Server.MapPath("~/ScheduledReports/");        

        #endregion

        #region CONNECTION STRING OBJECT

        // connection string object
        public static string cSFlexeDisplayData = ConfigurationManager.ConnectionStrings["Flex-eDisplayData"].ConnectionString;
        public static string cSFlexeDisplay = ConfigurationManager.ConnectionStrings["Flex-eDisplay"].ConnectionString;
        public static string cSFlexeManager = ConfigurationManager.ConnectionStrings["Flex-eManager"].ConnectionString;
        public static string cSFlexeReport = ConfigurationManager.ConnectionStrings["Flex-eReport"].ConnectionString;
        public static string cSFlexeUser = ConfigurationManager.ConnectionStrings["Flex-eUser"].ConnectionString;

        #region COMMON VARIABLES

        // user current log detail
        public static List<User_Log> lstUserlog = new List<User_Log>();      

        #endregion

        #endregion

        #region ENCRYPTION & DECERYPTION

        // Encrypt string for security purpose 
        public static string EncryptString(string value)
        {
            try
            {
                // encrypt cipher text
                return Convert.ToBase64String(System.Text.ASCIIEncoding.ASCII.GetBytes(value));
            }
            catch
            {
                // exception if any 
                return String.Empty;
            }
        }

        // Decrypt the string in readable form      
        public static string DecryptString(string value)
        {
            try
            {
                // retrurn cipher text
                return System.Text.ASCIIEncoding.ASCII.GetString(Convert.FromBase64String(value));
            }
            catch
            {
                return String.Empty;
            }
        }

        #endregion

        #region CHECK NULLABLE

        // check datet time is dbnull
        public static DateTime? isDateDBNull(object value)
        {
            // check condition
            if (value == DBNull.Value)
                return null;

            // convert to datetime
            return Convert.ToDateTime(value);
        }

        // check datet time is dbnull
        public static Double? isNumericDBNull(object value)
        {
            // check condition
            if (value == DBNull.Value)
                return null;

            // convert
            return Convert.ToDouble(value);
        }

        #endregion

        #region GET LOCAL MACHINE IP ADDRESS

        // get ip address
        public static string getIPAdress()
        {
            // get IP Address                
            //return Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
            return HttpContext.Current.Request.UserHostAddress.ToString();
        }

        // get request address id
        public static int GetRequestUserId()
        { 
            // get             
            return Convert.ToInt32(HttpContext.Current.Request.Headers["X-User-Id"]);
        }

        // get session token
        public static string GetSessionToken()
        {
            // get             
            return Convert.ToString(HttpContext.Current.Request.Headers["Session-Token"]);
        }

        #endregion
    }
}