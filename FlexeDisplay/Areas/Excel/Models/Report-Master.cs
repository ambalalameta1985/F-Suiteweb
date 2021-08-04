using FlexeDisplay.App_Code;
using FlexeDisplay.GlobalModule;
using SQLiteDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlexeDisplay.Areas.Excel.Models
{
    public class Report_Master : Report_Config
    {
        public int Report_Id { get; set; }
        public string Report_Name { get; set; }
        public int Report_Type_Id { get; set; }
        public string Description { get; set; }

        // retrieve report detail
        public IEnumerable<Report_Master> retrieveReportMaster(int iReportTypeId)
        {
            try
            {
                // retrieev report master for instant collection
                List<Report_Master> lstReportMaster = new List<Report_Master>();

                // set connection string
                SQliteComLibrary.connectionString = Global.cSFlexeReport;

                // fetch record set
                Recordset record = SQliteComLibrary.dbSelection("SELECT RM.*,RC.CATEGORY_CODE CATEGORY_CODE FROM REPORT_MASTER RM INNER JOIN REPORT_CONFIG RC ON RM.REPORT_ID=RC.REPORT_ID  WHERE REPORT_TYPE_ID=" + iReportTypeId);

                // set record at intial point
                record.MoveFirst();

                // check whether record cursor position is not too end point
                while (!record.EOF)
                {
                    // create report object
                    Report_Master reportMaster = new Report_Master();
                    reportMaster.Report_Id = Convert.ToInt32(record.Fields["REPORT_ID"].Value);
                    reportMaster.Report_Name = Convert.ToString(record.Fields["REPORT_NAME"].Value);
                    reportMaster.Report_Type_Id = Convert.ToInt32(record.Fields["REPORT_TYPE_ID"].Value);
                    reportMaster.Description = Convert.ToString(record.Fields["DESCRIPTION"].Value);
                    reportMaster.Category_Code = Convert.ToString(record.Fields["CATEGORY_CODE"].Value);
                 
                    //append to class
                    lstReportMaster.Add(reportMaster);

                    // move record next position
                    record.MoveNext();
                }

                // return true , if successfully execute
                return lstReportMaster;
            }
            catch (Exception ex)
            {
                // exception handling
                ClassErrorHandle.ErrorHandle("Error ! while retriving reports for instant detail", ex);

                // return null
                throw ex;
            }
        }
    }
}