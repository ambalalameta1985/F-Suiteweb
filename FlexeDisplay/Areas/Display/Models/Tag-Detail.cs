using FlexeDisplay.App_Code;
using FlexeDisplay.GlobalModule;
using SQLiteDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlexeDisplay.Areas.Display.Models
{
    public class Tag_Detail
    {
        public virtual int Display_Id { get; set; }
        public virtual int Tag_Id { get; set; }
        public virtual string Tag_Name { get; set; }
        public virtual string Full_Path { get; set; }
        public virtual string ShowsValueIn { get; set; }
        public virtual string Unit { get; set; }
        public virtual double? Scale_Min { get; set; }
        public virtual double? Scale_Max { get; set; }
        public virtual double? Hi_Value { get; set; }
        public virtual double? Hi_Hi_Value { get; set; }
        public virtual double? Lo_Value { get; set; }
        public virtual double? Lo_Lo_Value { get; set; }
        public virtual string Value_Type { get; set; }
        public virtual string Value { get; set; }
        public virtual DateTime? Timestamp { get; set; }
        public virtual string MinValue { get; set; }
        public virtual DateTime? MinTimestamp { get; set; }
        public virtual string MaxValue { get; set; }
        public virtual DateTime? MaxTimestamp { get; set; }
        public virtual string Quality { get; set; }
        public virtual int Significance { get; set; }
        public virtual string TrendColorCode { get; set; }
        public virtual Mimic_Tag MimicTag { get; set; }
        public virtual bool IsCurrentUser { get; set; }

        #region METHOD

        // display details
        public IEnumerable<Tag_Detail> retrieveTags(string displayId)
        {
            try
            {
                // set connection string
                SQliteComLibrary.connectionString = Global.cSFlexeDisplay;

                // fetch record set -  SELECT * FROM SELECTED_TAG_DETAILS WHERE DISPLAY_ID =" + iDisplayId
                Recordset record = SQliteComLibrary.dbSelection("SELECT ST.*,TD.COLOR_CODE COLOR_CODE FROM SELECTED_TAG_DETAILS ST LEFT JOIN TREND_TAG_DETAILS TD ON (ST.DISPLAY_ID = TD.DISPLAY_ID AND ST.TAG_ID = TD.TAG_ID)  WHERE ST.DISPLAY_ID IN (" + displayId + ")");

                // set record at intial point
                record.MoveFirst();

                // collection tag
                List<Tag_Detail> tagDetails = new List<Tag_Detail>();

                // if current user
                Boolean IsCurrentUser = Global.lstUserlog.Where(l => l.IPAddress.Equals(Global.getIPAdress())).Count() > 0;

                // check whether record cursor position is not too end point
                while (!record.EOF)
                {
                    // create report object
                    Tag_Detail tagDetail = new Tag_Detail();
                    tagDetail.Display_Id = Convert.ToInt32(record.Fields["Display_Id"].Value);
                    tagDetail.Tag_Id = Convert.ToInt32(record.Fields["Tag_Id"].Value);
                    tagDetail.Tag_Name = Convert.ToString(record.Fields["Tag_Name"].Value);
                    tagDetail.Full_Path = Convert.ToString(record.Fields["Full_Path"].Value);
                    tagDetail.ShowsValueIn = Convert.ToString(record.Fields["ShowsValueIn"].Value);
                    tagDetail.Unit = Convert.ToString(record.Fields["Unit"].Value);
                    tagDetail.Scale_Min = Global.isNumericDBNull(record.Fields["Scale_Min"].Value);
                    tagDetail.Scale_Max = Global.isNumericDBNull(record.Fields["Scale_Max"].Value);
                    tagDetail.Hi_Value = Global.isNumericDBNull(record.Fields["Hi_Value"].Value);
                    tagDetail.Hi_Hi_Value = Global.isNumericDBNull(record.Fields["Hi_Hi_Value"].Value);
                    tagDetail.Lo_Value = Global.isNumericDBNull(record.Fields["Lo_Value"].Value);
                    tagDetail.Lo_Lo_Value = Global.isNumericDBNull(record.Fields["Lo_Lo_Value"].Value);
                    tagDetail.Value_Type = Convert.ToString(record.Fields["Value_Type"].Value);
                    tagDetail.TrendColorCode = Convert.ToString(record.Fields["Color_Code"].Value);
                    tagDetail.MimicTag = new Mimic_Tag();
                    tagDetail.Value = "NA";
                    tagDetail.MinValue = "NA";
                    tagDetail.MaxValue = "NA";
                    tagDetail.Quality = "BAD";
                    tagDetail.Significance = 0;
                    tagDetail.IsCurrentUser = IsCurrentUser;

                    //append to class
                    tagDetails.Add(tagDetail);

                    // move record next position
                    record.MoveNext();
                }
              
               
                // pass to view
                return tagDetails;
            }
            catch (Exception ex)
            {
                // log error
                ClassErrorHandle.ErrorHandle("Error ! while fetch tag data", ex);

                // return empty
                throw ex;
            }
        }
      
        // retrieve mid tag
        public IEnumerable<Tag_Detail> retrieveMISTag(string tagId)
        {
            try
            {
                // set connection string
                SQliteComLibrary.connectionString = Global.cSFlexeManager;

                // fetch record set -  SELECT * FROM SELECTED_TAG_DETAILS WHERE DISPLAY_ID =" + iDisplayId
                Recordset record = SQliteComLibrary.dbSelection("SELECT TM.NAME TAG_NAME,TD.* FROM TAG_MASTER TM LEFT JOIN TAG_DETAILS TD ON TM.TAG_ID=TD.TAG_ID WHERE TM.PARENT_ID = '"+ tagId +"' AND TM.TAG_TYPE_ID=2");

                // set record at intial point
                record.MoveFirst();

                // collection tag
                List<Tag_Detail> tagDetails = new List<Tag_Detail>();

                // if current user
                Boolean IsCurrentUser = Global.lstUserlog.Where(l => l.IPAddress.Equals(Global.getIPAdress())).Count() > 0;

                // check whether record cursor position is not too end point
                while (!record.EOF)
                {
                    // create report object
                    Tag_Detail tagDetail = new Tag_Detail();                    
                    tagDetail.Tag_Id = Convert.ToInt32(record.Fields["TAG_ID"].Value);
                    tagDetail.Tag_Name = Convert.ToString(record.Fields["TAG_NAME"].Value);                    
                    tagDetail.Unit = Convert.ToString(record.Fields["UNIT"].Value);
                    tagDetail.Scale_Min = Global.isNumericDBNull(record.Fields["RANGE_MINIMUM"].Value);
                    tagDetail.Scale_Max = Global.isNumericDBNull(record.Fields["RANGE_MAXIMUM"].Value);
                    tagDetail.Hi_Value = Global.isNumericDBNull(record.Fields["ALARM_HL"].Value);
                    tagDetail.Hi_Hi_Value = Global.isNumericDBNull(record.Fields["ALARM_HH"].Value);
                    tagDetail.Lo_Value = Global.isNumericDBNull(record.Fields["ALARM_LH"].Value);
                    tagDetail.Lo_Lo_Value = Global.isNumericDBNull(record.Fields["ALARM_LL"].Value);                    
                    tagDetail.MimicTag = new Mimic_Tag();
                    tagDetail.Value = "NA";
                    tagDetail.MinValue = "NA";
                    tagDetail.MaxValue = "NA";
                    tagDetail.Quality = "BAD";
                    tagDetail.Significance = 0;
                    tagDetail.IsCurrentUser = IsCurrentUser;

                    //append to class
                    tagDetails.Add(tagDetail);

                    // move record next position
                    record.MoveNext();
                }
               
                // pass to view
                return tagDetails;
            }
            catch (Exception ex)
            {
                // log error
                ClassErrorHandle.ErrorHandle("Error ! while fetch tag data", ex);

                // return empty
                throw ex;
            }
        }
      
        #endregion
    }
}