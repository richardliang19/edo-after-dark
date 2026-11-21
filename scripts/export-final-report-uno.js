// Windows JScript OLE bridge. Only the supplied revision is opened and saved.
var manager = new ActiveXObject("com.sun.star.ServiceManager");
var desktop = manager.createInstance("com.sun.star.frame.Desktop");
function property(name, value) {
    var p = manager.Bridge_GetStruct("com.sun.star.beans.PropertyValue");
    p.Name = name; p.Value = value; return p;
}
function fileUrl(path) { return encodeURI("file:///" + path.replace(/\\/g, "/")); }
var document = null;
try {
    document = desktop.loadComponentFromURL(fileUrl(WScript.Arguments(0)), "_blank", 0, [property("Hidden", true)]);
    if (!document) throw new Error("The revision could not be opened.");
    var indexes = document.getDocumentIndexes();
    for (var i = 0; i < indexes.getCount(); i++) indexes.getByIndex(i).update();
    document.getTextFields().refresh();
    document.store();
    document.storeToURL(fileUrl(WScript.Arguments(1)), [property("FilterName", "writer_pdf_Export"), property("Overwrite", true), property("FilterData", [property("UseLosslessCompression", true), property("ReduceImageResolution", false), property("MaxImageResolution", 300), property("Quality", 100)])]);
    WScript.Echo("Saved original-derived DOCX and PDF with " + indexes.getCount() + " updated indexes.");
} finally {
    if (document) document.close(true);
    // Do not terminate LibreOffice; another user document might belong to it.
}
