using FlexeDisplay.App_Code;
using FlexeDisplay.GlobalModule;
using SQLiteDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlexeDisplay.Areas.Display.Models
{
    public class MyDisplay_Detail : MyDisplay_Header
    {
        #region PROPERTIES
        public int Display_Id { get; set; }
        public string Display_Css { get; set; }

        #endregion

        #region MYDISPLAY_METHOD

        // my display detail
        public IEnumerable<MyDisplay_Detail> retrieveMyDisplayDetail()
        {
            try
            {
                // retrieev my display detail collection
                List<MyDisplay_Detail> lstMyDisplayDetail = new List<MyDisplay_Detail>();

                // set connection string
                SQliteComLibrary.connectionString = Global.cSFlexeDisplay;

                // fetch record set
                Recordset record = SQliteComLibrary.dbSelection("SELECT * FROM MYDISPLAY_HEADER MH INNER JOIN  MYDISPLAY_DETAILS MD");

                // set record at intial point
                record.MoveFirst();

                // check whether record cursor position is not too end point
                while (!record.EOF)
                {
                    // create report object
                    MyDisplay_Detail myDisplayDetail = new MyDisplay_Detail();
                    myDisplayDetail.MyDisplay_Id = Convert.ToInt32(record.Fields["MYDISPLAY_ID"].Value);
                    myDisplayDetail.MyDisplay_Name = Convert.ToString(record.Fields["MYDISPLAY_NAME"].Value);
                    myDisplayDetail.Display_Id = Convert.ToInt32(record.Fields["DISPLAY_ID"].Value);
                    myDisplayDetail.Display_Css = Convert.ToString(record.Fields["DISPLAY_CSS"].Value);
                    myDisplayDetail.Description = Convert.ToString(record.Fields["DESCRIPTION"].Value);
                   
                    //append to class
                    lstMyDisplayDetail.Add(myDisplayDetail);

                    // move record next position
                    record.MoveNext();
                }

                // return true , if successfully execute
                return lstMyDisplayDetail;
            }
            catch (Exception ex)
            {
                 // exception handling
                ClassErrorHandle.ErrorHandle("Error ! while retriving my-Display detail", ex);

                // return null
                throw ex;              
            }
        }

        #endregion
    }    
}