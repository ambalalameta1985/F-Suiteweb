using FlexeDisplay.App_Code;
using FlexeDisplay.Areas.Display.Models;
using FlexeDisplay.GlobalModule;
using SQLiteDb;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace FlexeDisplay.Areas.District.Models
{
    public class Tag_Hierarchy
    {
        #region CONSTRUCTOR

        // initilize object
        public Tag_Hierarchy()
        {
            CHILD = new List<Tag_Hierarchy>();
        }

        #endregion

        #region PROPERTIES

        public int TAG_ID { get; set; }
        public string NAME { get; set; }
        public int PARENT_ID { get; set; }
        public int TAG_TYPE_ID { get; set; }
        public Tag_Detail TAG_DETAIL { get; set; }
        public List<Tag_Hierarchy> CHILD { get; set; }

        #endregion
    
        #region FUNCTIONALITY

        // retrieve tag hierarchy
        public IEnumerable<Tag_Hierarchy> retrieveTags()
        {
            try
            {
                // retrieve tag hierarchy
                List<Tag_Hierarchy> lstTagHierarchy = new List<Tag_Hierarchy>();

                // set connection string
                SQliteComLibrary.connectionString = Global.cSFlexeManager;

                // fetch record set
                Recordset record = SQliteComLibrary.dbSelection("SELECT * FROM TAG_MASTER TM WHERE TM.TAG_TYPE_ID=1 AND (SELECT COUNT(*) FROM TAG_MASTER TMC WHERE TMC.PARENT_ID=TM.TAG_ID AND TMC.TAG_TYPE_ID IN(1,2))>0");

                // if eof exists then return tag
                if (record.EOF)
                    return lstTagHierarchy;

                // set record at intial point
                record.MoveFirst();

                // check whether record cursor position is not too end point
                while (!record.EOF)
                {
                    // create report object
                    Tag_Hierarchy tagDetail = new Tag_Hierarchy();
                    tagDetail.TAG_ID = Convert.ToInt32(record.Fields["TAG_ID"].Value);
                    tagDetail.NAME = Convert.ToString(record.Fields["NAME"].Value);
                    tagDetail.PARENT_ID = Convert.ToInt32(record.Fields["PARENT_ID"].Value);
                    tagDetail.TAG_TYPE_ID = Convert.ToInt32(record.Fields["TAG_TYPE_ID"].Value);

                    //append to class
                    lstTagHierarchy.Add(tagDetail);

                    // move record next position
                    record.MoveNext();
                }

                // return true , if successfully execute
                return lstTagHierarchy;
            }
            catch (Exception ex)
            {
                // exception handling
                ClassErrorHandle.ErrorHandle("Error ! while retriving tag hierarchy", ex);

                // return null
                throw ex;
            }
        }

        // retrieve tag hierarchy
        public IEnumerable<Tag_Hierarchy> retrieveTimeStampedTag(string tagId)
        {
            try
            {
                // retrieve tag hierarchy
                List<Tag_Hierarchy> lstTagHierarchy = new List<Tag_Hierarchy>();

                // set connection string
                SQliteComLibrary.connectionString = Global.cSFlexeManager;

                // fetch record set
                //SELECT * FROM TAG_MASTER TM LEFT JOIN TAG_DETAILS TD ON TM.TAG_ID=TD.TAG_ID WHERE TM.TAG_TYPE_ID IN (1,2) and (case when tm.tag_type_id=1 then (SELECT COUNT(*) FROM TAG_MASTER TMC WHERE TMC.PARENT_ID=TM.TAG_ID AND TMC.TAG_TYPE_ID IN(1,2)) else 1 end)>0
                Recordset record = SQliteComLibrary.dbSelection("SELECT * FROM TAG_MASTER TM LEFT JOIN TAG_DETAILS TD ON TM.TAG_ID=TD.TAG_ID WHERE TM.PARENT_ID = '"+ tagId +"' AND TM.TAG_TYPE_ID=2");

                // if eof exists then return tag
                if (record.EOF)
                    return lstTagHierarchy;

                // set record at intial point
                record.MoveFirst();

                // check whether record cursor position is not too end point
                while (!record.EOF)
                {
                    // create report object
                    Tag_Hierarchy tagDetail = new Tag_Hierarchy();
                    tagDetail.TAG_ID = Convert.ToInt32(record.Fields["TAG_ID"].Value);
                    tagDetail.NAME = Convert.ToString(record.Fields["NAME"].Value);
                    tagDetail.PARENT_ID = Convert.ToInt32(record.Fields["PARENT_ID"].Value);
                    tagDetail.TAG_TYPE_ID = Convert.ToInt32(record.Fields["TAG_TYPE_ID"].Value);
                    tagDetail.TAG_DETAIL = new Tag_Detail()
                    {
                        Tag_Id = Convert.ToInt32(record.Fields["TAG_ID"].Value),
                        Tag_Name = Convert.ToString(record.Fields["NAME"].Value),
                        Unit = Convert.ToString(record.Fields["UNIT"].Value),
                        Scale_Min = Global.isNumericDBNull(record.Fields["RANGE_MINIMUM"].Value),
                        Scale_Max = Global.isNumericDBNull(record.Fields["RANGE_MAXIMUM"].Value),
                        Hi_Value = Global.isNumericDBNull(record.Fields["ALARM_HL"].Value),
                        Hi_Hi_Value = Global.isNumericDBNull(record.Fields["ALARM_HH"].Value),
                        Lo_Value = Global.isNumericDBNull(record.Fields["ALARM_LH"].Value),
                        Lo_Lo_Value = Global.isNumericDBNull(record.Fields["ALARM_LL"].Value),
                        MimicTag = new Mimic_Tag(),
                        Value = "NA",
                        MinValue = "NA",
                        MaxValue = "NA",
                        Quality = "BAD",
                        Significance = 0,
                    };

                    //append to class
                    lstTagHierarchy.Add(tagDetail);

                    // move record next position
                    record.MoveNext();
                }

                // return true , if successfully execute
                return lstTagHierarchy;
            }
            catch (Exception ex)
            {
                // exception handling
                ClassErrorHandle.ErrorHandle("Error ! while retriving tag hierarchy", ex);

                // return null
                throw ex;
            }
        }

        #endregion
    }
}
