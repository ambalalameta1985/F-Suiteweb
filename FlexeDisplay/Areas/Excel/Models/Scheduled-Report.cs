using FlexeDisplay.GlobalModule;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace FlexeDisplay.Areas.Excel.Models
{
    public class Scheduled_Report
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public DateTime ReportDate { get; set; }

        #region METHOD

        // retrieve excel template
        public IEnumerable<Scheduled_Report> retrieveScheduledReports()
        {
            try
            {
                // scheduled report collection
                List<Scheduled_Report> lstScheduled_Report = new List<Scheduled_Report>();

                // fetch detail of excel templates
                foreach (var dir in Directory.GetDirectories(Global.scheduledReportsPath))
                {
                    // iterate with report
                    foreach (var report in Directory.GetFiles(dir))
                    {
                        // directory name
                        string directoryName = new DirectoryInfo(dir).Name;

                        // create excel template object
                        Scheduled_Report scheduled_Report = new Scheduled_Report();
                        scheduled_Report.Id = lstScheduled_Report.Count + 1;
                        scheduled_Report.Name = Path.GetFileNameWithoutExtension(report).Replace('-', ' ');
                        scheduled_Report.Url = "/ScheduledReports/" + directoryName + "/" + Path.GetFileName(report);
                        scheduled_Report.ReportDate = Convert.ToDateTime(directoryName);

                        // append excel template to collection
                        lstScheduled_Report.Add(scheduled_Report);
                    }
                }

                // order by descending 
                lstScheduled_Report =  lstScheduled_Report.OrderByDescending(l => l.ReportDate).ToList();
                return lstScheduled_Report;
            }
            catch (Exception)
            {
                return null;
            }
        }

        #endregion
    }
}