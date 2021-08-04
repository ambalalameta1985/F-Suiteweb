using FlexeDisplay.App_Code;
using FlexeDisplay.Areas.Excel.Models;
using FlexeDisplay.GlobalModule;
using Microsoft.Office.Interop.Excel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FlexeDisplay.Areas.Excel.Controllers
{
    public class ReportController : Controller
    {
        // report master object
        Report_Master report_Master = new Report_Master();
        Scheduled_Report scheduled_Report = new Scheduled_Report();

        // get report master
        public ActionResult REPORTMASTER()
        {
            try
            {
                // fetch default interval report
                int iReportTypeId = (int)Enums.eReportType.INTERVAL;

                // retrieve json
                return Json(report_Master.retrieveReportMaster(iReportTypeId).ToList(),
                                JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return null;
            }
        }

        // get generate master
        public ActionResult GENERATEREPORT(int iReportId, DateTime dStartDate, DateTime dEndDate)
        {
            try
            {
                // resultant path for report
                string resultantPath = String.Empty;

                // flexereport dll instance
                Flex_eReport.FlxReport.Flex_eReport flexReport = new Flex_eReport.FlxReport.Flex_eReport();

                // excel template directory
                string excelTemplateDirectory = System.Web.Configuration.WebConfigurationManager.AppSettings["ExcelTemplatePath"];

                // destionation path
                string destinationPath = Server.MapPath("~") + "InstantReports\\";

                // generate report
                if (flexReport.GenerateReport(iReportId, dStartDate, dEndDate, excelTemplateDirectory, destinationPath))
                {
                    resultantPath = System.IO.Path.GetFileName(flexReport.ReportPath);

                    // open file
                    //System.Diagnostics.Process.Start(Server.MapPath("~") + "InstantReports\\" + resultantPath);
                }
                else
                    ClassErrorHandle.ErrorHandle(flexReport.ErrorDescription, new Exception("INSTANT REPORT"));

                // return empty
                return Json(resultantPath, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // error handle
                ClassErrorHandle.ErrorHandle("Error ! While generate instant report", ex);

                return null;
            }
        }

        // get scheduled report
        public ActionResult SCHEDULEDREPORTS()
        {
            try
            {
                // retrieve json
                return Json(scheduled_Report.retrieveScheduledReports().ToList(),
                                JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // error handle
                ClassErrorHandle.ErrorHandle("Error ! While retrieve scheduled report", ex);

                return null;
            }
        }
    }
}
