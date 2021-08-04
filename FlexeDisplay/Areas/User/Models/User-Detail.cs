using FlexeDisplay.App_Code;
using FlexeDisplay.GlobalModule;
using SQLiteDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlexeDisplay.Areas.User.Models
{
    public class User_Detail
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string LoginName { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
        public bool IsActive { get; set; }

        #region METHOD

        // retrieve user details
        public User_Detail authenticateUser(Login login)
        {
            try
            {
                // set connection string
                SQliteComLibrary.connectionString = Global.cSFlexeUser;

                // fetch record set -  SELECT * FROM SELECTED_TAG_DETAILS WHERE DISPLAY_ID =" + iDisplayId
                Recordset record = SQliteComLibrary.dbSelection("SELECT * FROM USER_MASTER WHERE LOGIN_NAME='" + login.UserName + "' and PASSWORD='" + login.Password + "'");
             

                // check whether record cursor position is not too end point
                if (!record.EOF)
                {
                    // set record at intial point
                    record.MoveFirst();

                    // fetch record set -  SELECT * FROM SELECTED_TAG_DETAILS WHERE DISPLAY_ID =" + iDisplayId
                    record = SQliteComLibrary.dbSelection("SELECT * FROM USER_MASTER UM INNER JOIN ROLE_PROCESS RP ON UM.ROLE_ID=RP.ROLE_ID WHERE UM.LOGIN_NAME='" + login.UserName + "' and UM.PASSWORD='" + login.Password + "' AND RP.PROCESS_ID=205");

                    // user detail object
                    User_Detail userDetail = new User_Detail();

                    // check whether record cursor position is not too end point
                    if (!record.EOF)
                    {
                       
                        userDetail.Id = Convert.ToInt32(record.Fields["USER_ID"].Value);
                        userDetail.UserName = Convert.ToString(record.Fields["USER_NAME"].Value);
                        userDetail.LoginName = Convert.ToString(record.Fields["LOGIN_NAME"].Value);
                        userDetail.Password = Convert.ToString(record.Fields["PASSWORD"].Value);
                        userDetail.RoleId = Convert.ToInt32(record.Fields["ROLE_ID"].Value);
                        userDetail.IsActive = Convert.ToBoolean(record.Fields["ISACTIVE"].Value);                        
                    }

                    // return user
                    return userDetail;
                }

                // pass to view
                return null;
            }
            catch (Exception ex)
            {
                // user table not exists
                //if (ex.HResult.Equals(-2147220991))
                //{
                //    if (createUserSchema())
                //       return authenticateUser(login);
                //}

                // log error
                ClassErrorHandle.ErrorHandle("Error ! while login", ex);

                // return empty
                return null;
            }
        }

        // create user 
        public int createUser(string sUserName, string sPassword)
        {
            try
            {
                // fetch record set -  SELECT * FROM SELECTED_TAG_DETAILS WHERE DISPLAY_ID =" + iDisplayId
                Recordset record = SQliteComLibrary.dbSelection("SELECT COUNT(*) TOTAL FROM USER");

                // check whether record cursor position is not too end point
                if (!record.EOF)
                {
                    if (Convert.ToInt32(record.Fields["TOTAL"].Value) >= 10)
                        return (int)Enums.eSignupUser.LIMIT_EXCEED;
                }

                // fetch record set -  SELECT * FROM SELECTED_TAG_DETAILS WHERE DISPLAY_ID =" + iDisplayId
                record = SQliteComLibrary.dbSelection("SELECT * FROM USER WHERE USERNAME='" + sUserName + "'");

                // check whether record cursor position is not too end point
                if (!record.EOF)
                    return (int)Enums.eSignupUser.EXIST_USER;

                // query of insert data
                string sQuery = "INSERT INTO USER(USERNAME,PASSWORD,JOINDATE) values('" + sUserName + "','" + sPassword + "','" + DateTime.Now + "')";

                // return status
                return (int)SQliteComLibrary.dbExecuteQuery(sQuery);
            }
            catch (Exception ex)
            {
                // log error
                ClassErrorHandle.ErrorHandle("Error ! while create user", ex);

                // return empty
                return (int)Enums.eSignupUser.FAILED;
            }
        }

        // create user 
        public bool createUserSchema()
        {
            try
            {
                // fetch record set -  SELECT * FROM SELECTED_TAG_DETAILS WHERE DISPLAY_ID =" + iDisplayId
                SQliteComLibrary.dbExecuteQuery("CREATE TABLE USER(ID INTEGER PRIMARY KEY AUTOINCREMENT,USERNAME VARCHAR,PASSWORD VARCHAR,JOINDATE TIMESTAMP)");
                SQliteComLibrary.dbExecuteQuery("INSERT INTO USER(USERNAME,PASSWORD,JOINDATE) VALUES('Admin','Admin',CURRENT_TIMESTAMP)");
                SQliteComLibrary.dbExecuteQuery("INSERT INTO USER(USERNAME,PASSWORD,JOINDATE) VALUES('Master','Master',CURRENT_TIMESTAMP)");
                return true;
            }
            catch (Exception ex)
            {
                // log error
                ClassErrorHandle.ErrorHandle("Error ! while create user schema", ex);
                return false;
            }
        }

        #endregion
    }
}