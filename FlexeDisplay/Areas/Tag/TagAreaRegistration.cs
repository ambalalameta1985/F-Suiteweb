using System.Web.Mvc;

namespace FlexeDisplay.Areas.Tag
{
    public class TagAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Tag";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            // district hierarchy
            context.MapRoute(
                "Tag Hierarchy",
                "Tag/Tag/TAGHIERARCHY",
                new { controller = "Tag", action = "TAGHIERARCHY", id = UrlParameter.Optional }
            );

            // district hierarchy
            context.MapRoute(
                "Tag Timestamped",
                "Tag/Tag/TIMESPAMPEDTAG",
                new { controller = "Tag", action = "TIMESPAMPEDTAG", id = UrlParameter.Optional }
            );
        }
    }
}
