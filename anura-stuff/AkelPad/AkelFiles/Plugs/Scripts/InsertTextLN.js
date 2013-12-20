// InsertTextLN.js - ver. 2012-03-04
// http://akelpad.sourceforge.net/forum/viewtopic.php?p=8939#8939
// Insert text and line number at the beginning and at the end of selection
//
// Call("Scripts::Main", 1, "InsertTextLN.js", "0") - insert in selection
// Call("Scripts::Main", 1, "InsertTextLN.js", "1") - insert in each of selected lines
// Call("Scripts::Main", 1, "InsertTextLN.js", "2") - insert in each part of columnar selection
//
// Argument "0" is default, can be omitted.

var oSys = AkelPad.SystemFunction();

if (oSys.Call("kernel32::GetUserDefaultLangID") == 0x0415) //Polish
{
  var pTxtCaption   = "Wstaw tekst i numer wiersza";
  var pTxtRO        = "Tryb tylko do odczytu.";
  var pTxtInvArg    = "Błędny argument: ";
  var pTxtNoColSel  = "Brak zaznaczenia pionowego.";
  var pTxtA         =["na początku zaznaczenia:",
                      "na początku wierszy:",
                      "z lewej każdej części zaznaczenia pionow.:"];
  var pTxtB         =["na końcu zaznaczenia:",
                      "na końcu wierszy:",
                      "z prawej każdej części zaznaczenia pionow.:"];
  var pTxtEscNL     = "\\n = &Nowy wiersz";
  var pTxtEscTab    = "\\t = &Tabulacja";
  var pTxtRange     = "Zakres";
  var pTxtSelection = "Z&aznaczenie";
  var pTxtLines     = "Zaznaczone &wiersze";
  var pTxtColSel    = "Pionow&e zaznaczenie";
  var pTxtLNL       = "Numer wiersza z &Lewej";
  var pTxtLNR       = "Numer wiersza z &Prawej";
  var pTxtPadLN     = "Wypełnienie:";
  var pTxtPreLN     = "Prefiks:";
  var pTxtSufLN     = "Sufiks:";
  var pTxtRelLN     = "Numeracja względna";
  var pTxtIniLN     = "Pierwszy nr:";
  var pTxtStepLN    = "Skok:";
  var pTxtReplace   = "Usuń &zaznaczenie";
  var pTxtOK        = "OK";
  var pTxtCancel    = "Anuluj";
}
else
{
  var pTxtCaption   = "Insert text and line number";
  var pTxtRO        = "Mode is read-only.";
  var pTxtInvArg    = "Invalid argument: ";
  var pTxtNoColSel  = "There is no columnar selection.";
  var pTxtA         =["at beginning of selection:",
                      "at left of lines:",
                      "at left any part of columnar selection:"];
  var pTxtB         =["at end of selection:",
                      "at right of lines:",
                      "at right any part of columnar selection:"];
  var pTxtEscNL     = "\\n = &New line";
  var pTxtEscTab    = "\\t = &Tabulation";
  var pTxtRange     = "Range";
  var pTxtSelection = "S&election";
  var pTxtLines     = "Selecte&d lines";
  var pTxtColSel    = "&Columnar selection";
  var pTxtLNL       = "Line number at &Left";
  var pTxtLNR       = "Line number at &Right";
  var pTxtPadLN     = "Padding char:";
  var pTxtPreLN     = "Prefix:";
  var pTxtSufLN     = "Suffix:";
  var pTxtRelLN     = "Relative numbers";
  var pTxtIniLN     = "First number:";
  var pTxtStepLN    = "Step:";
  var pTxtReplace   = "Replace &selection";
  var pTxtOK        = "OK";
  var pTxtCancel    = "Cancel";
}

var hMainWnd     = AkelPad.GetMainWnd();
var hEditWnd     = AkelPad.GetEditWnd();
var hGuiFont     = oSys.Call("gdi32::GetStockObject", 17 /*DEFAULT_GUI_FONT*/);
var pScriptName  = WScript.ScriptName;
var hInstanceDLL = AkelPad.GetInstanceDll();
var bColSel      = AkelPad.SendMessage(hEditWnd, 3127 /*AEM_GETCOLUMNSEL*/, 0, 0);

var bCloseCombo = true;
var hWndDlg;
var lpBuffer;
var nLowParam;
var nHiwParam;
var i;

var nStrs    = 10;
var lpStrsA  = new Array(nStrs);
var lpStrsB  = new Array(nStrs);
for (i = 0; i < nStrs; ++i)
{
  lpStrsA[i] = "";
  lpStrsB[i] = "";
}

var bEscNL   = 0;
var bEscTab  = 1;
var nRange   = 0;
var bIsLNL   = 0;
var pPadLNL  = "";
var pPreLNL  = "";
var pSufLNL  = "";
var bRelLNL  = 0;
var pIniLNL  = "1";
var pStepLNL = "1";
var bIsLNR   = 0;
var pPadLNR  = "";
var pPreLNR  = "";
var pSufLNR  = "";
var bRelLNR  = 0;
var pIniLNR  = "1";
var pStepLNR = "1";
var bReplace = 0;

ReadWriteIni(0);

var pStrA = lpStrsA[0];
var pStrB = lpStrsB[0];

var lpWnd        = [];
var IDTXTA       = 1000;
var IDTXTB       = 1001;
var IDSTRA       = 1002;
var IDSTRB       = 1003;
var IDLNL        = 1004;
var IDISLNL      = 1005;
var IDTXTPADLNL  = 1006;
var IDPADLNL     = 1007;
var IDTXTPRELNL  = 1008;
var IDTXTSUFLNL  = 1009;
var IDPRELNL     = 1010;
var IDSUFLNL     = 1011;
var IDRELLNL     = 1012;
var IDTXTINILNL  = 1013;
var IDTXTSTEPLNL = 1014;
var IDINILNL     = 1015;
var IDSTEPLNL    = 1016;
var IDESC        = 1017;
var IDESCNL      = 1018;
var IDESCTAB     = 1019;
var IDRANGE      = 1020;
var IDSELECTION  = 1021;
var IDLINES      = 1022;
var IDCOLSEL     = 1023;
var IDLNR        = 1024;
var IDISLNR      = 1025;
var IDTXTPADLNR  = 1026;
var IDPADLNR     = 1027;
var IDTXTPRELNR  = 1028;
var IDTXTSUFLNR  = 1029;
var IDPRELNR     = 1030;
var IDSUFLNR     = 1031;
var IDRELLNR     = 1032;
var IDTXTINILNR  = 1033;
var IDTXTSTEPLNR = 1034;
var IDINILNR     = 1035;
var IDSTEPLNR    = 1036;
var IDREPLACE    = 1037;
var IDOK         = 1038;
var IDCANCEL     = 1039;

var WNDTYPE  = 0;
var WND      = 1;
var WNDEXSTY = 2;
var WNDSTY   = 3;
var WNDX     = 4;
var WNDY     = 5;
var WNDW     = 6;
var WNDH     = 7;
var WNDTXT   = 8;

//0x50000000 - WS_VISIBLE|WS_CHILD
//0x50000007 - WS_VISIBLE|WS_CHILD|BS_GROUPBOX
//0x50000009 - WS_VISIBLE|WS_CHILD|BS_AUTORADIOBUTTON
//0x50010000 - WS_VISIBLE|WS_CHILD|WS_TABSTOP
//0x50010001 - WS_VISIBLE|WS_CHILD|WS_TABSTOP|BS_DEFPUSHBUTTON
//0x50010003 - WS_VISIBLE|WS_CHILD|WS_TABSTOP|BS_AUTOCHECKBOX
//0x50010080 - WS_VISIBLE|WS_CHILD|WS_TABSTOP|ES_AUTOHSCROLL
//0x50012080 - WS_VISIBLE|WS_CHILD|WS_TABSTOP|ES_AUTOHSCROLL|ES_NUMBER
//0x50210042 - WS_VISIBLE|WS_CHILD|WS_TABSTOP|WS_VSCROLL|CBS_DROPDOWN|CBS_AUTOHSCROLL
//Windows      WNDTYPE, WND,WNDEXSTY,     WNDSTY,WNDX,WNDY,WNDW,WNDH,        WNDTXT
lpWnd[IDTXTA      ] = ["STATIC",   0,       0, 0x50000000,  11,  13, 220,  13, ""];
lpWnd[IDTXTB      ] = ["STATIC",   0,       0, 0x50000000, 241,  13, 220,  13, ""];
lpWnd[IDSTRA      ] = ["COMBOBOX", 0,       0, 0x50210042,  11,  28, 220,  20, ""];
lpWnd[IDSTRB      ] = ["COMBOBOX", 0,       0, 0x50210042, 241,  28, 220,  20, ""];
lpWnd[IDLNL       ] = ["BUTTON",   0,       0, 0x50000007,  11,  55, 150, 173, ""];
lpWnd[IDISLNL     ] = ["BUTTON",   0,       0, 0x50010003,  18,  69, 140,  16, pTxtLNL];
lpWnd[IDTXTPADLNL ] = ["STATIC",   0,       0, 0x50000000,  18,  93,  70,  13, pTxtPadLN];
lpWnd[IDPADLNL    ] = ["EDIT",     0,   0x200, 0x50010080,  89,  90,  20,  20, pPadLNL];
lpWnd[IDTXTPRELNL ] = ["STATIC",   0,       0, 0x50000000,  18, 116,  65,  13, pTxtPreLN];
lpWnd[IDTXTSUFLNL ] = ["STATIC",   0,       0, 0x50000000,  89, 116,  65,  13, pTxtSufLN];
lpWnd[IDPRELNL    ] = ["EDIT",     0,   0x200, 0x50010080,  18, 131,  65,  20, pPreLNL];
lpWnd[IDSUFLNL    ] = ["EDIT",     0,   0x200, 0x50010080,  89, 131,  65,  20, pSufLNL];
lpWnd[IDRELLNL    ] = ["BUTTON",   0,       0, 0x50010003,  18, 164, 140,  16, pTxtRelLN];
lpWnd[IDTXTINILNL ] = ["STATIC",   0,       0, 0x50000000,  18, 185,  65,  13, pTxtIniLN];
lpWnd[IDTXTSTEPLNL] = ["STATIC",   0,       0, 0x50000000,  89, 185,  65,  13, pTxtStepLN];
lpWnd[IDINILNL    ] = ["EDIT",     0,   0x200, 0x50012080,  18, 200,  65,  20, pIniLNL];
lpWnd[IDSTEPLNL   ] = ["EDIT",     0,   0x200, 0x50012080,  89, 200,  65,  20, pStepLNL];
lpWnd[IDESC       ] = ["BUTTON",   0,       0, 0x50000007, 171,  55, 130,  57, ""];
lpWnd[IDESCNL     ] = ["BUTTON",   0,       0, 0x50010003, 178,  69, 120,  16, pTxtEscNL];
lpWnd[IDESCTAB    ] = ["BUTTON",   0,       0, 0x50010003, 178,  90, 120,  16, pTxtEscTab];
lpWnd[IDRANGE     ] = ["BUTTON",   0,       0, 0x50000007, 171, 117, 130,  80, pTxtRange];
lpWnd[IDSELECTION ] = ["BUTTON",   0,       0, 0x50000009, 178, 135, 120,  16, pTxtSelection];
lpWnd[IDLINES     ] = ["BUTTON",   0,       0, 0x50000009, 178, 155, 120,  16, pTxtLines];
lpWnd[IDCOLSEL    ] = ["BUTTON",   0,       0, 0x50000009, 178, 175, 120,  16, pTxtColSel];
lpWnd[IDLNR       ] = ["BUTTON",   0,       0, 0x50000007, 310,  55, 150, 173, ""];
lpWnd[IDISLNR     ] = ["BUTTON",   0,       0, 0x50010003, 317,  69, 140,  16, pTxtLNR];
lpWnd[IDTXTPADLNR ] = ["STATIC",   0,       0, 0x50000000, 317,  93,  70,  13, pTxtPadLN];
lpWnd[IDPADLNR    ] = ["EDIT",     0,   0x200, 0x50010080, 388,  90,  20,  20, pPadLNR];
lpWnd[IDTXTPRELNR ] = ["STATIC",   0,       0, 0x50000000, 317, 116,  65,  13, pTxtPreLN];
lpWnd[IDTXTSUFLNR ] = ["STATIC",   0,       0, 0x50000000, 388, 116,  65,  13, pTxtSufLN];
lpWnd[IDPRELNR    ] = ["EDIT",     0,   0x200, 0x50010080, 317, 131,  65,  20, pPreLNR];
lpWnd[IDSUFLNR    ] = ["EDIT",     0,   0x200, 0x50010080, 388, 131,  65,  20, pSufLNR];
lpWnd[IDRELLNR    ] = ["BUTTON",   0,       0, 0x50010003, 317, 164, 140,  16, pTxtRelLN];
lpWnd[IDTXTINILNR ] = ["STATIC",   0,       0, 0x50000000, 317, 185,  65,  13, pTxtIniLN];
lpWnd[IDTXTSTEPLNR] = ["STATIC",   0,       0, 0x50000000, 388, 185,  65,  13, pTxtStepLN];
lpWnd[IDINILNR    ] = ["EDIT",     0,   0x200, 0x50012080, 317, 200,  65,  20, pIniLNR];
lpWnd[IDSTEPLNR   ] = ["EDIT",     0,   0x200, 0x50012080, 388, 200,  65,  20, pStepLNR];
lpWnd[IDREPLACE   ] = ["BUTTON",   0,       0, 0x50010003, 178, 205, 120,  16, pTxtReplace];
lpWnd[IDOK        ] = ["BUTTON",   0,       0, 0x50010001, 171, 225,  61,  23, pTxtOK];
lpWnd[IDCANCEL    ] = ["BUTTON",   0,       0, 0x50010000, 240, 225,  61,  23, pTxtCancel];


if (hEditWnd)
{
   if (AkelPad.GetEditReadOnly(hEditWnd))
  {
    AkelPad.MessageBox(hEditWnd, pTxtRO, pTxtCaption, 48 /*MB_ICONEXCLAMATION*/);
    WScript.Quit();
  }

  if (WScript.Arguments.length)
    nRange = parseInt(WScript.Arguments(0));
  if (!((nRange == 0) || (nRange == 1) || (nRange == 2)))
  {
    AkelPad.MessageBox(hEditWnd, pTxtInvArg + nRange, pTxtCaption, 48 /*MB_ICONEXCLAMATION*/);
    WScript.Quit();
  }
  if ((nRange == 2) && (! bColSel))
  {
    AkelPad.MessageBox(hEditWnd, pTxtNoColSel, pTxtCaption, 48 /*MB_ICONEXCLAMATION*/);
    WScript.Quit();
  }


  if (AkelPad.WindowRegisterClass(pScriptName))
  {
    if (lpBuffer=AkelPad.MemAlloc(256 * _TSIZE))
    {
      //Create dialog
      AkelPad.MemCopy(lpBuffer, pScriptName, _TSTR);
      hWndDlg=oSys.Call("user32::CreateWindowEx" + _TCHAR,
                        0,               //dwExStyle
                        lpBuffer,        //lpClassName
                        0,               //lpWindowName
                        0x90CA0000,      //WS_VISIBLE|WS_POPUP|WS_CAPTION|WS_SYSMENU|WS_MINIMIZEBOX
                        0,               //x
                        0,               //y
                        477,             //nWidth
                        285,             //nHeight
                        hMainWnd,        //hWndParent
                        0,               //ID
                        hInstanceDLL,    //hInstance
                        DialogCallback); //Script function callback. To use it class must be registered by WindowRegisterClass.
      if (hWndDlg)
      {
        //Disable main window, to make dialog modal
        oSys.Call("user32::EnableWindow", hMainWnd, false);

        //Message loop
        AkelPad.WindowGetMessage();
      }
      AkelPad.MemFree(lpBuffer);
    }
    AkelPad.WindowUnregisterClass(pScriptName);
  }
}

//////////////
function DialogCallback(hWnd, uMsg, wParam, lParam)
{
  if (uMsg == 1)  //WM_CREATE
  {
    //Dialog caption
    AkelPad.MemCopy(lpBuffer, pTxtCaption, _TSTR);
    oSys.Call("user32::SetWindowText" + _TCHAR, hWnd, lpBuffer);

    //Create windows
    for (i = 1000; i < lpWnd.length; ++i)
    {
      AkelPad.MemCopy(lpBuffer, lpWnd[i][WNDTYPE], _TSTR);
      lpWnd[i][WND] = oSys.Call("user32::CreateWindowEx" + _TCHAR,
                                lpWnd[i][WNDEXSTY],//dwExStyle
                                lpBuffer,          //lpClassName
                                0,                 //lpWindowName
                                lpWnd[i][WNDSTY],  //dwStyle
                                lpWnd[i][WNDX],    //x
                                lpWnd[i][WNDY],    //y
                                lpWnd[i][WNDW],    //nWidth
                                lpWnd[i][WNDH],    //nHeight
                                hWnd,              //hWndParent
                                i,                 //ID
                                hInstanceDLL,      //hInstance
                                0);                //lpParam
      //Set font and text
      SetWindowFontAndText(lpWnd[i][WND], hGuiFont, lpWnd[i][WNDTXT]);
    }

    SetWindowFontAndText(lpWnd[IDTXTA][WND], hGuiFont, pTxtA[nRange]);
    SetWindowFontAndText(lpWnd[IDTXTB][WND], hGuiFont, pTxtB[nRange]);

    //Fill combobox
    for (i = 0; i < nStrs; ++i)
    {
      AkelPad.MemCopy(lpBuffer, lpStrsA[i], _TSTR);
      AkelPad.SendMessage(lpWnd[IDSTRA][WND], 0x143 /*CB_ADDSTRING*/, 0, lpBuffer);
      AkelPad.MemCopy(lpBuffer, lpStrsB[i], _TSTR);
      AkelPad.SendMessage(lpWnd[IDSTRB][WND], 0x143 /*CB_ADDSTRING*/, 0, lpBuffer);
    }
    AkelPad.SendMessage(lpWnd[IDSTRA][WND], 0x14E /*CB_SETCURSEL*/, 0, 0);
    AkelPad.SendMessage(lpWnd[IDSTRB][WND], 0x14E /*CB_SETCURSEL*/, 0, 0);

    //Check
    if (bIsLNL)  AkelPad.SendMessage(lpWnd[IDISLNL][WND],  241 /*BM_SETCHECK*/, 1 /*BST_CHECKED*/, 0);
    if (bRelLNL) AkelPad.SendMessage(lpWnd[IDRELLNL][WND], 241 /*BM_SETCHECK*/, 1 /*BST_CHECKED*/, 0);
    for (i = IDTXTPADLNL; i <= IDRELLNL; ++i)
      oSys.Call("user32::EnableWindow", lpWnd[i][WND], bIsLNL);
    for (i = IDTXTINILNL; i <= IDSTEPLNL; ++i)
      oSys.Call("user32::EnableWindow", lpWnd[i][WND], (bIsLNL && bRelLNL));

    if (bEscNL)  AkelPad.SendMessage(lpWnd[IDESCNL][WND],  241 /*BM_SETCHECK*/, 1 /*BST_CHECKED*/, 0);
    if (bEscTab) AkelPad.SendMessage(lpWnd[IDESCTAB][WND], 241 /*BM_SETCHECK*/, 1 /*BST_CHECKED*/, 0);
    AkelPad.SendMessage(lpWnd[IDSELECTION + nRange][WND], 241 /*BM_SETCHECK*/, 1 /*BST_CHECKED*/, 0);
    oSys.Call("user32::EnableWindow", lpWnd[IDCOLSEL][WND], bColSel);

    if (bIsLNR)  AkelPad.SendMessage(lpWnd[IDISLNR][WND],  241 /*BM_SETCHECK*/, 1 /*BST_CHECKED*/, 0);
    if (bRelLNR) AkelPad.SendMessage(lpWnd[IDRELLNR][WND], 241 /*BM_SETCHECK*/, 1 /*BST_CHECKED*/, 0);
    for (i = IDTXTPADLNR; i <= IDRELLNR; ++i)
      oSys.Call("user32::EnableWindow", lpWnd[i][WND], bIsLNR);
    for (i = IDTXTINILNR; i <= IDSTEPLNR; ++i)
      oSys.Call("user32::EnableWindow", lpWnd[i][WND], (bIsLNR && bRelLNR));
    if (bReplace) AkelPad.SendMessage(lpWnd[IDREPLACE][WND], 241 /*BM_SETCHECK*/, 1 /*BST_CHECKED*/, 0);

    //Set limit edit text
    AkelPad.SendMessage(lpWnd[IDPADLNL][WND], 197 /*EM_LIMITTEXT*/, 1, 0);
    AkelPad.SendMessage(lpWnd[IDPADLNR][WND], 197 /*EM_LIMITTEXT*/, 1, 0);

    //Center dialog
    CenterWindow(hEditWnd, hWnd);
  }

  else if (uMsg == 7)  //WM_SETFOCUS
    oSys.Call("user32::SetFocus", lpWnd[IDSTRA][WND]);

  else if (uMsg == 256)  //WM_KEYDOWN
  {
    if (bCloseCombo)
    {
      if (wParam == 27)  //VK_ESCAPE
        //Escape key pushes Cancel button
        oSys.Call("user32::PostMessage" + _TCHAR, hWndDlg, 273 /*WM_COMMAND*/, IDCANCEL, 0);
      else if (wParam == 13)  //VK_RETURN
        //Return key pushes OK button
        oSys.Call("user32::PostMessage" + _TCHAR, hWndDlg, 273 /*WM_COMMAND*/, IDOK, 0);
    }
  }

  else if (uMsg == 273)  //WM_COMMAND
  {
    nLowParam = LoWord(wParam);
    nHiwParam = HiWord(wParam);

    if ((nLowParam == IDSTRA) || (nLowParam == IDSTRB))
    {
      if (nHiwParam == 7 /*CBN_DROPDOWN*/)
        bCloseCombo = false;
      else if (nHiwParam == 8 /*CBN_CLOSEUP*/)
        bCloseCombo = true;
    }

    else if ((nLowParam == IDISLNL) || (nLowParam == IDRELLNL))
    {
      bIsLNL  = AkelPad.SendMessage(lpWnd[IDISLNL][WND],  240 /*BM_GETCHECK*/, 0, 0);
      bRelLNL = AkelPad.SendMessage(lpWnd[IDRELLNL][WND], 240 /*BM_GETCHECK*/, 0, 0);
      for (i = IDTXTPADLNL; i <= IDRELLNL; ++i)
        oSys.Call("user32::EnableWindow", lpWnd[i][WND], bIsLNL);
      for (i = IDTXTINILNL; i <= IDSTEPLNL; ++i)
        oSys.Call("user32::EnableWindow", lpWnd[i][WND], (bIsLNL && bRelLNL));
    }

    else if (nLowParam == IDESCNL)
      bEscNL = AkelPad.SendMessage(lpWnd[IDESCNL][WND], 240 /*BM_GETCHECK*/, 0, 0);

    else if (nLowParam == IDESCTAB)
      bEscTab = AkelPad.SendMessage(lpWnd[IDESCTAB][WND], 240 /*BM_GETCHECK*/, 0, 0);

    else if ((nLowParam >= IDSELECTION) && (nLowParam <= IDCOLSEL))
    {
      nRange = nLowParam - IDSELECTION;
      SetWindowFontAndText(lpWnd[IDTXTA][WND], hGuiFont, pTxtA[nRange]);
      SetWindowFontAndText(lpWnd[IDTXTB][WND], hGuiFont, pTxtB[nRange]);
    }

    else if ((nLowParam == IDISLNR) || (nLowParam == IDRELLNR))
    {
      bIsLNR  = AkelPad.SendMessage(lpWnd[IDISLNR][WND],  240 /*BM_GETCHECK*/, 0, 0);
      bRelLNR = AkelPad.SendMessage(lpWnd[IDRELLNR][WND], 240 /*BM_GETCHECK*/, 0, 0);
      for (i = IDTXTPADLNR; i <= IDRELLNR; ++i)
        oSys.Call("user32::EnableWindow", lpWnd[i][WND], bIsLNR);
      for (i = IDTXTINILNR; i <= IDSTEPLNR; ++i)
        oSys.Call("user32::EnableWindow", lpWnd[i][WND], (bIsLNR && bRelLNR));
    }

    else if (nLowParam == IDREPLACE)
      bReplace = AkelPad.SendMessage(lpWnd[IDREPLACE][WND], 240 /*BM_GETCHECK*/, 0, 0);

    else if (nLowParam == IDOK)
    {
      //pStrA
      oSys.Call("user32::GetWindowText" + _TCHAR, lpWnd[IDSTRA][WND], lpBuffer, 256);
      pStrA = AkelPad.MemRead(lpBuffer, _TSTR);
      for (i = 0; i < nStrs; ++i)
      {
        if (lpStrsA[i] == pStrA)
          lpStrsA.splice(i, 1);
      }
      lpStrsA.unshift(pStrA);
      if (lpStrsA.length > nStrs)
        lpStrsA.pop();
      else
      {
        while (lpStrsA.length < nStrs)
          lpStrsA.push("");
      }

      //pStrB
      oSys.Call("user32::GetWindowText" + _TCHAR, lpWnd[IDSTRB][WND], lpBuffer, 256);
      pStrB = AkelPad.MemRead(lpBuffer, _TSTR);
      for (i = 0; i < nStrs; ++i)
      {
        if (lpStrsB[i] == pStrB)
          lpStrsB.splice(i, 1);
      }
      lpStrsB.unshift(pStrB);
      if (lpStrsB.length > nStrs)
        lpStrsB.pop();
      else
      {
        while (lpStrsB.length < nStrs)
          lpStrsB.push("");
      }

      //pPadLNL
      oSys.Call("user32::GetWindowText" + _TCHAR, lpWnd[IDPADLNL][WND], lpBuffer, 256);
      pPadLNL = AkelPad.MemRead(lpBuffer, _TSTR);

      //pPreLNL
      oSys.Call("user32::GetWindowText" + _TCHAR, lpWnd[IDPRELNL][WND], lpBuffer, 256);
      pPreLNL = AkelPad.MemRead(lpBuffer, _TSTR);

      //pSufLNL
      oSys.Call("user32::GetWindowText" + _TCHAR, lpWnd[IDSUFLNL][WND], lpBuffer, 256);
      pSufLNL = AkelPad.MemRead(lpBuffer, _TSTR);

      //pIniLNL
      oSys.Call("user32::GetWindowText" + _TCHAR, lpWnd[IDINILNL][WND], lpBuffer, 256);
      pIniLNL = AkelPad.MemRead(lpBuffer, _TSTR);

      //pStepLNL
      oSys.Call("user32::GetWindowText" + _TCHAR, lpWnd[IDSTEPLNL][WND], lpBuffer, 256);
      pStepLNL = AkelPad.MemRead(lpBuffer, _TSTR);

      //pPadLNR
      oSys.Call("user32::GetWindowText" + _TCHAR, lpWnd[IDPADLNR][WND], lpBuffer, 256);
      pPadLNR = AkelPad.MemRead(lpBuffer, _TSTR);

      //pPreLNR
      oSys.Call("user32::GetWindowText" + _TCHAR, lpWnd[IDPRELNR][WND], lpBuffer, 256);
      pPreLNR = AkelPad.MemRead(lpBuffer, _TSTR);

      //pSufLNR
      oSys.Call("user32::GetWindowText" + _TCHAR, lpWnd[IDSUFLNR][WND], lpBuffer, 256);
      pSufLNR = AkelPad.MemRead(lpBuffer, _TSTR);

      //pIniLNR
      oSys.Call("user32::GetWindowText" + _TCHAR, lpWnd[IDINILNR][WND], lpBuffer, 256);
      pIniLNR = AkelPad.MemRead(lpBuffer, _TSTR);

      //pStepLNR
      oSys.Call("user32::GetWindowText" + _TCHAR, lpWnd[IDSTEPLNR][WND], lpBuffer, 256);
      pStepLNR = AkelPad.MemRead(lpBuffer, _TSTR);

      InsertText();

      oSys.Call("user32::PostMessage" + _TCHAR, hWndDlg, 16 /*WM_CLOSE*/, 0, 0);
    }

    else if (nLowParam == IDCANCEL)
      oSys.Call("user32::PostMessage" + _TCHAR, hWndDlg, 16 /*WM_CLOSE*/, 0, 0);
  }

  else if (uMsg == 16)  //WM_CLOSE
  {
    ReadWriteIni(1);

    //Enable main window
    oSys.Call("user32::EnableWindow", hMainWnd, true);

    //Destroy dialog
    oSys.Call("user32::DestroyWindow", hWnd);
  }

  else if (uMsg == 2)  //WM_DESTROY
  {
    //Exit message loop
    oSys.Call("user32::PostQuitMessage", 0);
  }

  else
  {
    if (oSys.Call("user32::GetFocus") != lpWnd[IDCANCEL][WND])
      oSys.Call("user32::DefDlgProc" + _TCHAR, hWnd, 1025 /*DM_SETDEFID*/, IDOK, 0);
  }

  return 0;
}

function SetWindowFontAndText(hWnd, hFont, pText)
{
  var lpWindowText;

  AkelPad.SendMessage(hWnd, 48 /*WM_SETFONT*/, hFont, true);

  if (lpWindowText=AkelPad.MemAlloc(256 * _TSIZE))
  {
    AkelPad.MemCopy(lpWindowText, pText.substr(0, 255), _TSTR);
    oSys.Call("user32::SetWindowText" + _TCHAR, hWnd, lpWindowText);

    AkelPad.MemFree(lpWindowText);
  }
}

function CenterWindow(hWndParent, hWnd)
{
  var lpRect;
  var rcWndParent=[];
  var rcWnd=[];
  var X;
  var Y;

  if (lpRect=AkelPad.MemAlloc(16))  //sizeof(RECT)
  {
    if (!hWndParent)
      hWndParent=oSys.Call("user32::GetDesktopWindow");

    oSys.Call("user32::GetWindowRect", hWndParent, lpRect);
    RectToArray(lpRect, rcWndParent);

    oSys.Call("user32::GetWindowRect", hWnd, lpRect);
    RectToArray(lpRect, rcWnd);

    //Center window
    X=rcWndParent.left + ((rcWndParent.right - rcWndParent.left) / 2 - (rcWnd.right - rcWnd.left) / 2);
    Y=rcWndParent.top + ((rcWndParent.bottom - rcWndParent.top) / 2 - (rcWnd.bottom - rcWnd.top) / 2);

    oSys.Call("user32::SetWindowPos", hWnd, 0, X, Y, 0, 0, 0x15 /*SWP_NOZORDER|SWP_NOACTIVATE|SWP_NOSIZE*/);

    AkelPad.MemFree(lpRect);
  }
}

function RectToArray(lpRect, rcRect)
{
  rcRect.left=AkelPad.MemRead(lpRect, 3 /*DT_DWORD*/);
  rcRect.top=AkelPad.MemRead(lpRect + 4, 3 /*DT_DWORD*/);
  rcRect.right=AkelPad.MemRead(lpRect + 8, 3 /*DT_DWORD*/);
  rcRect.bottom=AkelPad.MemRead(lpRect + 12, 3 /*DT_DWORD*/);
  return rcRect;
}

function LoWord(nParam)
{
  return (nParam & 0xffff);
}

function HiWord(nParam)
{
  return ((nParam >> 16) & 0xffff);
}

function ReadWriteIni(bWrite)
{
  var oFSO     = new ActiveXObject("Scripting.FileSystemObject");
  var pIniName = WScript.ScriptFullName.substring(0, WScript.ScriptFullName.lastIndexOf(".")) + ".ini";
  var nError;
  var oFile;
  var pTxtIni;
  var i;

  if (bWrite)
  {
    pTxtIni = 'lpStrsA=[';

    for (i = 0; i < nStrs; ++i)
    {
      pTxtIni += '"' + lpStrsA[i].replace(/[\\"]/g, "\\$&") + '"';
      if (i < (nStrs - 1))
        pTxtIni += ',';
      else
        pTxtIni += '];\r\nlpStrsB=[';
    }

    for (i = 0; i < nStrs; ++i)
    {
      pTxtIni += '"' + lpStrsB[i].replace(/[\\"]/g, "\\$&") + '"';
      if (i < (nStrs - 1))
        pTxtIni += ',';
      else
        pTxtIni += '];\r\n';
    }

    pTxtIni += 'bEscNL='    + bEscNL   + ';\r\n' +
               'bEscTab='   + bEscTab  + ';\r\n' +
               'bIsLNL='    + bIsLNL   + ';\r\n' +
               'pPadLNL="'  + pPadLNL.replace(/[\\"]/g, "\\$&") + '";\r\n' +
               'pPreLNL="'  + pPreLNL.replace(/[\\"]/g, "\\$&") + '";\r\n' +
               'pSufLNL="'  + pSufLNL.replace(/[\\"]/g, "\\$&") + '";\r\n' +
               'bRelLNL='   + bRelLNL  + ';\r\n' +
               'pIniLNL="'  + pIniLNL  + '";\r\n' +
               'pStepLNL="' + pStepLNL + '";\r\n' +
               'bIsLNR='    + bIsLNR   + ';\r\n' +
               'pPadLNR="'  + pPadLNR.replace(/[\\"]/g, "\\$&") + '";\r\n' +
               'pPreLNR="'  + pPreLNR.replace(/[\\"]/g, "\\$&") + '";\r\n' +
               'pSufLNR="'  + pSufLNR.replace(/[\\"]/g, "\\$&") + '";\r\n' +
               'bRelLNR='   + bRelLNR  + ';\r\n' +
               'pIniLNR="'  + pIniLNR  + '";\r\n' +
               'pStepLNR="' + pStepLNR + '";\r\n' +
               'bReplace='  + bReplace + ';'

    oFile = oFSO.OpenTextFile(pIniName, 2, true, -1);
    oFile.Write(pTxtIni);
    oFile.Close();
  }

  else if (oFSO.FileExists(pIniName))
  {
    try
    {
      eval(AkelPad.ReadFile(pIniName));
    }
    catch (nError)
    {
    }
  }
}

function SetRedraw(hWnd, bRedraw)
{
   var oSys = AkelPad.SystemFunction();
   AkelPad.SendMessage(hWnd, 11 /*WM_SETREDRAW*/, bRedraw, 0);
   bRedraw && oSys.Call("user32::InvalidateRect", hWnd, 0, true);
}

function Pad(pString, nLen, pType, pChar)
{
  var i = 0;

  if (! pType) pType = "R";
  if (! pChar) pChar = " ";

  if (pType == "R")
  {
    while (pString.length < nLen)
      pString += pChar;
  }
  else if (pType == "L")
  {
    while (pString.length < nLen)
      pString = pChar + pString;
  }
  else if (pType == "C")
  {
    while (pString.length < nLen)
    {
      if ((i % 2) == 0)
        pString += pChar;
      else
        pString = pChar + pString;
      ++ i;
    }
  }
  return pString;
}

function InsertText()
{
  var nWordWrap = AkelPad.SendMessage(hEditWnd, 3241 /*AEM_GETWORDWRAP*/, 0, 0);

  SetRedraw(hEditWnd, false);
  if (nWordWrap > 0)
    AkelPad.Command(4209 /*IDM_VIEW_WORDWRAP*/);

  var nBegSel   = AkelPad.GetSelStart();
  var nEndSel   = AkelPad.GetSelEnd();
  var nLine1    = AkelPad.SendMessage(hEditWnd, 1078 /*EM_EXLINEFROMCHAR*/, 0, nBegSel);
  var nLine2    = AkelPad.SendMessage(hEditWnd, 1078 /*EM_EXLINEFROMCHAR*/, 0, nEndSel);
  var nLines    = nLine2 - nLine1 + 1;
  var lpLinNumL = new Array(nLines);
  var lpLinNumR = new Array(nLines);
  var nStep;
  var nIniNum;
  var nLenNum;
  var lpLines;
  var pTxt;
  var i;

  for (i=0; i < nLines; ++i)
  {
    lpLinNumL[i] = "";
    lpLinNumR[i] = "";
  }

  if (bEscNL)
  {
    pStrA = pStrA.replace(/\\n/g, "\r");
    pStrB = pStrB.replace(/\\n/g, "\r");
  }
  if (bEscTab)
  {
    pStrA = pStrA.replace(/\\t/g, "\t");
    pStrB = pStrB.replace(/\\t/g, "\t");
  }

  if (bIsLNL)
  {
    if (pPadLNL == "")
      pPadLNL = " ";

    if (bRelLNL)
    {
      nStep   = parseInt(pStepLNL);
      nIniNum = parseInt(pIniLNL);
      nLenNum = String((nIniNum + nStep * (nLines - 1))).length;
    }
    else
    {
      nStep   = 1;
      nIniNum = nLine1 + 1;
      nLenNum = String(nLine2 + 1).length;
    }

    for (i=0; i < nLines; ++i)
      lpLinNumL[i] = pPreLNL + Pad(String(nIniNum + nStep * i), nLenNum, "L", pPadLNL) + pSufLNL;
  }

  if (bIsLNR)
  {
    if (pPadLNR == "")
      pPadLNR = " ";

    if (bRelLNR)
    {
      nStep   = parseInt(pStepLNR);
      nIniNum = parseInt(pIniLNR);
      nLenNum = String((nIniNum + nStep * (nLines - 1))).length;
    }
    else
    {
      nStep   = 1;
      nIniNum = nLine1 + 1;
      nLenNum = String(nLine2 + 1).length;
    }

    for (i=0; i < nLines; ++i)
      lpLinNumR[i] = pPreLNR + Pad(String(nIniNum + nStep * i), nLenNum, "L", pPadLNR) + pSufLNR;
  }


  // insert in selection
  if (nRange == 0)
    pTxt = pStrA + lpLinNumL[0] +
           (bReplace ? "" : AkelPad.GetSelText(1 /*\r*/)) +
           lpLinNumR[nLines - 1] + pStrB;

  // insert in each of selected lines and columnar selection
  else
  {
    if (nRange == 1)
    {
      nEndSel = AkelPad.SendMessage(hEditWnd, 187 /*EM_LINEINDEX*/, nLine2, 0) + AkelPad.SendMessage(hEditWnd, 193 /*EM_LINELENGTH*/, nEndSel, 0);
      AkelPad.SetSel(nBegSel, nEndSel);
    }

    pTxt    = AkelPad.GetSelText(1 /*\r*/);
    lpLines = pTxt.split("\r");

    for (i=0; i < nLines; ++i)
      lpLines[i] = pStrA + lpLinNumL[i] +
                   (bReplace ? "" : lpLines[i]) +
                   lpLinNumR[i] + pStrB;

    pTxt = lpLines.join("\r");
  }

  AkelPad.ReplaceSel(pTxt, true);

  if (((nRange == 0) && bColSel) || (nRange == 2))
    AkelPad.SendMessage(hEditWnd, 3128 /*AEM_UPDATESEL*/, 0x1 /*AESELT_COLUMNON*/, 0);

  if (nWordWrap > 0)
    AkelPad.Command(4209 /*IDM_VIEW_WORDWRAP*/);
  SetRedraw(hEditWnd, true);
}
