using FlexeDisplay.App_Code;
using FlexeDisplay.GlobalModule;
using MySql.Data.MySqlClient;
using SQLiteDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlexeDisplay.Areas.Display.Models
{
    public class Parameter_Value
    {
        public virtual int Tag_Id { get; set; }
        public virtual string Value { get; set; }
        public virtual DateTime? Timestamp { get; set; }
        public virtual string Quality { get; set; }
        public virtual int Significance { get; set; }
        public virtual bool IsCurrentUser { get; set; }

        #region METHOD

        // display details
        public IEnumerable<Parameter_Value> retrieveParameterValue(string tagKeys)
        {
            // connection
            MySqlConnection connection = new MySqlConnection(Global.cSFlexeDisplayData);

            // command object
            MySqlCommand command = new MySqlCommand();

            try
            {

                // pass connection object
                command.Connection = connection;

                //open connection
                connection.Open();

                // pass query
                command.CommandText = "SELECT * FROM PARAMETER_VALUE WHERE TAG_ID IN (" + tagKeys + ")";

                // text command
                command.CommandType = System.Data.CommandType.Text;

                // command
                MySqlDataReader reader = command.ExecuteReader();

                // collection tag
                List<Parameter_Value> lstParameterValue = new List<Parameter_Value>();

                // if current user                               
                Boolean IsCurrentUser = Global.lstUserlog
                            .Where(l => l.SessionToken.Equals(Global.GetSessionToken()) &&
                                        l.UserId.Equals(Global.GetRequestUserId())).Count() > 0;   
                
                while (reader.Read())
                {
                    Parameter_Value parameterValue = new Parameter_Value();
                    parameterValue.Tag_Id = Convert.ToInt32(reader["Tag_Id"]);
                    parameterValue.Value = Convert.ToString(reader["Value"]);
                    parameterValue.Timestamp = Global.isDateDBNull(reader["Time_Stamp"]);
                    parameterValue.Significance = Convert.ToInt32(reader["Significance"]);
                    parameterValue.Quality = Convert.ToString(reader["Quality"]);
                    parameterValue.IsCurrentUser = IsCurrentUser;
                    lstParameterValue.Add(parameterValue);
                }

                // pass to view
                return lstParameterValue;
            }
            catch (Exception ex)
            {
                // log error
                ClassErrorHandle.ErrorHandle("Error ! while fetch tag data", ex);

                // return empty
                throw ex;
            }
            finally
            {
                // connection close
                connection.Close();
            }
        }

        #endregion
    }
}