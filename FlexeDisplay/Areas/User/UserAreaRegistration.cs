using System.Web.Mvc;

namespace FlexeDisplay.Areas.User
{
    public class UserAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "User";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            // login routing
            context.MapRoute(
                "login",
                "User/User/Login",
                new { controller = "User", action = "Login", id = UrlParameter.Optional }
            );

            // create user routing
            context.MapRoute(
                "createUser",
                "User/User/create",
                new { controller = "User", action = "create", id = UrlParameter.Optional }
            );
        }
    }
}
