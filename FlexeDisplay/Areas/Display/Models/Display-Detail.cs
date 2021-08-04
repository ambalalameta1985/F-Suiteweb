using FlexeDisplay.App_Code;
using FlexeDisplay.GlobalModule;
using SQLiteDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlexeDisplay.Areas.Display.Models
{
    public class Display_Detail
    {
        public virtual int DisplayId { get; set; }
        public virtual string DisplayName { get; set; }
        public Display_Type DisplayTypeId { get; set; }
        public string Description { get; set; }
        public virtual bool IsCurrentUser { get; set; }
        public Mimic_Detail MimicDetail { get; set; }

        #region METHOD

        // retrieve display detail
        public  IEnumerable<Display_Detail> retrieveDisplayDetail()
        {
            try
            {
                // retrieev deiplay detail collection
                List<Display_Detail> lstDisplayDetail = new List<Display_Detail>();

                // set connection string
                SQliteComLibrary.connectionString = Global.cSFlexeDisplay;

                // fetch record set
                Recordset record = SQliteComLibrary.dbSelection("SELECT * FROM DISPLAY_DETAILS DD INNER JOIN DISPLAY_TYPE DT ON DD.DISPLAY_TYPE_ID = DT.DISPLAY_TYPE_ID");

                // set record at intial point
                record.MoveFirst();

                // if current user                               
                Boolean IsCurrentUser = Global.lstUserlog
                            .Where(l => l.SessionToken.Equals(Global.GetSessionToken()) &&
                                        l.UserId.Equals(Global.GetRequestUserId())).Count() > 0;

                // check whether record cursor position is not too end point
                while (!record.EOF)
                {
                    // create report object
                    Display_Detail displayDetail = new Display_Detail();
                    displayDetail.DisplayId = Convert.ToInt32(record.Fields["DISPLAY_ID"].Value);
                    displayDetail.DisplayName = Convert.ToString(record.Fields["DISPLAY_NAME"].Value);
                    displayDetail.DisplayTypeId = new Display_Type()
                    {
                        Id = Convert.ToInt32(record.Fields["DISPLAY_TYPE_ID"].Value),
                        DisplayType = Convert.ToString(record.Fields["DISPLAY_TYPE_NAME"].Value),
                        Description = Convert.ToString(record.Fields["DESCRIPTION"].Value)
                    };
                    displayDetail.Description = Convert.ToString(record.Fields["DESCRIPTION"].Value);
                    displayDetail.IsCurrentUser = IsCurrentUser;
                    displayDetail.MimicDetail = new Mimic_Detail();

                    //append to class
                    lstDisplayDetail.Add(displayDetail);

                    // move record next position
                    record.MoveNext();
                }

                // return true , if successfully execute
                return lstDisplayDetail;
            }
            catch (Exception ex)
            {
                // exception handling
                ClassErrorHandle.ErrorHandle("Error ! while retriving reports from display detail", ex);

                // return null
                throw ex;
            }
        }

        #endregion
    }
}