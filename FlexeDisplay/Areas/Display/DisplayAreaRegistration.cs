using System.Web.Mvc;

namespace FlexeDisplay.Areas.Display
{
    public class DisplayAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Display";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            // display type
            context.MapRoute(
                "Display Detail",
                "Display/DisplayType/GET",
                new { controller = "DisplayType", action = "GET", id = UrlParameter.Optional }
            );

            // Tag detail
            context.MapRoute(
                "Display Tag",
                "Display/DisplayType/TAG",
                new { controller = "DisplayType", action = "TAG", id = UrlParameter.Optional }
            );

            // Tag detail
            context.MapRoute(
                "Display MIS",
                "Display/DisplayType/MIS",
                new { controller = "DisplayType", action = "MIS", id = UrlParameter.Optional }
            );

            // Tag Value detail
            context.MapRoute(
                "Display Value",
                "Display/DisplayType/VALUE",
                new { controller = "DisplayType", action = "VALUE", id = UrlParameter.Optional }
            );

            // MyDisplay Value detail
            context.MapRoute(
                "MyDisplay Value",
                "Display/DisplayType/MYDISPLAY",
                new { controller = "DisplayType", action = "MYDISPLAY", id = UrlParameter.Optional }
            );
        }
    }
}
