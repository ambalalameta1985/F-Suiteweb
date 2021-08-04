using FlexeDisplay.Areas.District.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FlexeDisplay.Areas.Tag.Controllers
{
    public class TagController : Controller
    {
        #region VARIABLES

        // tag hierarchy object instances
        Tag_Hierarchy tagHierarchy = new Tag_Hierarchy();

        #endregion

        // get tag hierarchy list
        public ActionResult TAGHIERARCHY()
        {
            try
            {
                // retrieve json
                return Json(tagHierarchy.retrieveTags().ToList(),
                              JsonRequestBehavior.AllowGet);

            }
            catch
            {
                return null;
            }
        }

        // get tag hierarchy list
        public ActionResult TIMESPAMPEDTAG(string displayId)
        {
            try
            {
                // retrieve json
                return Json(tagHierarchy.retrieveTimeStampedTag(displayId).ToList(),
                              JsonRequestBehavior.AllowGet);

            }
            catch
            {
                return null;
            }
        }   
    }
}
