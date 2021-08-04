using FlexeDisplay.App_Code;
using FlexeDisplay.GlobalModule;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace FlexeDisplay.Areas.Display.Models
{
    public class Mimic_Detail
    {
        public double Width { get; set; }
        public double Height { get; set; }
        public int FontSize { get; set; }
        public string FontFamily { get; set; }
        public string ImageUrl { get; set; }
        public bool IsBold { get; set; }
        public bool IsItalic { get; set; }
        public bool IsTransparent { get; set; }
        public string BackgroundColor { get; set; }
        public string ForeColor { get; set; }
        public bool IsDisplayUnit { get; set; }

        #region METHOD

     
        #endregion
    }

}