using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlexeDisplay.GlobalModule
{
    public class Enums
    {
        public enum ExportExcelStatus
        { 
            SUCCESS = 1,
            FAILED = 2,
            INVALID_OPERATION = 3
        }

        public enum ExcelMenu
        { 
            AUTO_SCHEDULAR = 1,
            REPORT = 2
        }

        // report type for fetch
        public enum eReportTypeId
        { 
            INSTANT_REPORT = 1
        }

        // database status
        public enum eDbStatus
        { 
            SUCCESS = 1,
            FAILED = 2
        }

        // database status
        public enum eSignupUser
        {
            SUCCESS = 1,
            FAILED = 2,
            LIMIT_EXCEED = 3,
            EXIST_USER = 4
        }

        // display type
        public enum eDisplayType
        { 
            TRENDS = 1,
            GAUGES = 2,
            MIMICS =3,
            TABULARS = 4,
            SCROLLERS = 5,
            MYDISPLAYS = 6,
            ALARMS = 7
        }

        // report type
        public enum eReportType 
        {
            INTERVAL = 1,
            TIMESTAMP = 2,
            BATCH = 3,
            CUSTOM = 4
        }
    }
}