using System.Web.Mvc;

namespace FlexeDisplay.Areas.Excel
{
    public class ExcelAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Excel";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            // excel type
            context.MapRoute(
                "Instant Report",
                "Excel/Report/REPORTMASTER",
                new { controller = "Report", action = "REPORTMASTER", id = UrlParameter.Optional }
            );

            // excel type
            context.MapRoute(
                "Generate Report",
                "Excel/Report/GENERATEREPORT",
                new { controller = "Report", action = "GENERATEREPORT", id = UrlParameter.Optional }
            );

            // excel type
            context.MapRoute(
                "Scheduled Report",
                "Excel/Report/SCHEDULEDREPORTS",
                new { controller = "Report", action = "SCHEDULEDREPORTS", id = UrlParameter.Optional }
            );
        }
    }
}
