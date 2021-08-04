using FlexeDisplay.Areas.Display.Models;
using FlexeDisplay.GlobalModule;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace FlexeDisplay.Areas.Display.Controllers
{
    public class DisplayTypeController : Controller
    {
        #region MODEL OBJECT

        // display detail object
        Display_Detail displayDetail = new Display_Detail();
        MyDisplay_Detail myDisplayDetail = new MyDisplay_Detail();
        Tag_Detail tagDetail = new Tag_Detail();
        Parameter_Value parameterValue = new Parameter_Value();

        #endregion

        #region METHOD

        // clone mimic config
        public void cloneMimicConfig(List<Display_Detail> lstDisplayDetail)
        {
            try
            {
                // retrieve configuration count of mimic config
                Configuration config = WebConfigurationManager.OpenWebConfiguration(Request.ApplicationPath);

                // get mimic config count
                int mimicConfigCount = Convert.ToInt16(config.AppSettings.Settings["MimicsConfigCount"].Value);

                // if mimic config count is not equal
                if (lstDisplayDetail.Where(l => l.DisplayTypeId.Id.Equals((int)Enums.eDisplayType.MIMICS)).Count() != (mimicConfigCount / 2))
                {

                    // get mimic config count
                    string mimicConfigPath = config.AppSettings.Settings["MimicsConfigPath"].Value;
                    string[] files = System.IO.Directory.GetFiles(mimicConfigPath);
                    string fileName = "",
                            destFile = "",
                            targetPath = Server.MapPath("~") + "MimicsConfig";

                    // Copy the files and overwrite destination files if they already exist.
                    foreach (string s in files)
                    {
                        // Use static Path methods to extract only the file name from the path.
                        fileName = System.IO.Path.GetFileName(s);
                        destFile = System.IO.Path.Combine(targetPath, fileName);
                        System.IO.File.Copy(s, destFile, true);
                    }

                    config.AppSettings.Settings.Remove("MimicsConfigCount");
                    config.AppSettings.Settings.Add("MimicsConfigCount", files.Length.ToString());
                    config.Save();
                }
            }
            catch (Exception ex)
            {
                // log error
                FlexeDisplay.App_Code.ClassErrorHandle.ErrorHandle("Error! While clone mimic config", ex);
            }

        }

        #endregion

        // get display detail 
        public ActionResult GET()
        {
            try
            {
                // display detail
                List<Display_Detail> lstDisplayDetail = displayDetail.retrieveDisplayDetail().ToList();

                // clone mimic config if exists
                cloneMimicConfig(lstDisplayDetail);

                // retrieve json
                return Json(lstDisplayDetail, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return null;
            }
        }

        // get display detail 
        public ActionResult TAG(string displayId)
        {
            try
            {
                // retrieve json
                return Json(tagDetail.retrieveTags(displayId).ToList(),
                            JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return null;
            }
        }

        // get display detail 
        public ActionResult MIS(string displayId)
        {
            try
            {
                // retrieve json
                return Json(tagDetail.retrieveMISTag(displayId).ToList(),
                            JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return null;
            }
        }

        // get display detail 
        public ActionResult VALUE(string tagKeys)
        {
            try
            {
                // retrieve json
                return Json(parameterValue.retrieveParameterValue(tagKeys).ToList(),
                                JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return null;
            }
        }

        // get display detail 
        public ActionResult MYDISPLAY()
        {
            try
            {
                // retrieve mydisplay detail json
                return Json(myDisplayDetail.retrieveMyDisplayDetail(),
                                JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
