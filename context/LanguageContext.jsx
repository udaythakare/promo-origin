'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {

  /* ================= ENGLISH ================= */

  en: {
    investors: {
browseTitle: "Browse Investors",
sendRequest: "Send Request",
requestSent: "Request Sent",
alreadyConnected: "Connected",
viewProfile: "View Profile",
filterByRisk: "Filter by Risk",
filterByType: "Filter by Type",
all: "All",
low: "Low",
medium: "Medium",
high: "High",
expectedRoi: "Expected ROI",
horizon: "Investment Horizon",
industries: "Preferred Industries",
noInvestors: "No investors found",
noConnections: "No investor connections yet",
browseToConnect: "Browse investors to send connection requests",
connectionStatus: "Connection Status",
investorName: "Investor Name",
investorType: "Investor Type",
individual: "Individual",
company: "Company",
investmentRange: "Investment Range",
message: "Message",
connections: "Connections",    
  risk: "risk",
  requested: "Requested",
  decline: "Decline",
  accept: "Accept",
  openChat: "Open Chat",
  awaitingResponse: "Awaiting Response",
  declined: "Declined",
},

performanceChart: "Coupon Performance",
claims: "Claims",
redeemed: "Redeemed",

    analytics: {
  title: "Coupon Analytics",

  totalCoupons: "Total Available Coupons",
  totalClaims: "Total Claimed Coupons",
  totalRedemptions: "Total Redeemed Coupons",

  claimsChart: "Claims Over Time",
  performanceChart: "Coupon Performance",

  usersClaimed: "Users Who Claimed",
  usersRedeemed: "Users Who Redeemed",

  loading: "Loading analytics..."
},
    scanner: {
  title: "QR Code Scanner",
  start: "Start Scanning",
  stop: "Stop Scanning",
  instruction: "Position QR code within the frame",

  validUntil: "Valid Until",
  couponType: "Coupon Type",
  redeemAtStore: "Redeem at Store",

  status: "Status",
  alreadyRedeemed: "Already Redeemed",

  userDetails: "User Details",

  acceptCoupon: "Accept Coupon",
  acceptSuccess: "Coupon accepted successfully!",
  acceptError: "Error accepting coupon",

  scannedResult: "Scanned Result",
  copy: "Copy",

  processing: "Processing...",

  instructionDesktop: "This scanner works on desktop and mobile devices.",
  allowCamera: "Allow camera permissions when prompted to scan QR codes.",

  cameraNotSupported: "Your device does not support camera",
  permissionDenied: "Camera permission denied",
  libraryNotLoaded: "Scanner library not loaded",
  scriptError: "Failed to load QR scanner"
},

    business: {
  title: "Business Information",
  subtitle: "View and manage your registered business details",

  overview: "Business Overview",
  contact: "Contact Information",
  location: "Business Location",
  edit: "Edit Business Details",

  name: "Business Name",
  description: "Description",
  category: "Category",

  email: "Email",
  phone: "Phone",
  website: "Website",

  address: "Address",
  area: "Area",
  city: "City",
  state: "State",
  postalCode: "Postal Code",
  country: "Country",

  noData: "No business information found"
},

    sidebar: {
      vendorPortal: "Vendor Portal",
      dashboard: "Dashboard",
      coupons: "Coupons",
      businessInfo: "Business Info",
      scanCoupon: "Scan",
      analytics: "Analytics",
      investors: "Investors",
      browseInvestors: "Browse Investors",
      logout: "Logout",
      profile: "Profile"
    },

    dashboard: {
      title: "Dashboard Overview",
      totalCoupons: "Total Coupons",
      couponsRedeemed: "Coupons Redeemed",
      totalClaims: "Total Claims",
      activeCoupons: "Active Coupons",
      recentCoupons: "Recent Coupons",
      recentActivity: "Recent Activity",
      viewAllActivity: "View All Activity",
      noActivity: "No activity yet.",
      viewAll: "View All",
      loading: "Loading dashboard...",
      errorTitle: "Error Loading Data",
      tryAgain: "Try Again",
      noData: "No coupons found."
    },

    coupons: {
      addNewCoupon: "Add New Coupon",
      noCoupons: "No coupons found. Create your first coupon to get started!",
      claimed: "claimed",
      claims: "claims",
      type: "Type",
      redeemStore: "Redeem at Store",
      valid: "Valid",
      day: "Day",
      days: "Days",
      remaining: "Remaining",
      redeemed: "Redeemed",
      disabled: "Disabled",
      expired: "Expired",
      active: "Active",

      title: "Title",
      description: "Description",
      startDate: "Start Date & Time",
      endDate: "End Date & Time",
      maxClaims: "Max Claims",

      createCoupon: "Create Coupon",
      editCoupon: "Edit Coupon",
      updateCoupon: "Update Coupon",

      confirmDeletion: "Confirm Deletion",
      deleteWarning: "Are you sure you want to delete this coupon? This action cannot be undone.",
      deleteCoupon: "Delete Coupon",
      deleting: "Deleting...",

      originalTimes: "Original Coupon Times",
      start: "Start",
      end: "End",
      note: "Note",
      important: "Important",

      futureDates: "Only future dates and times can be selected.",
      unlimited: "Leave blank for unlimited",
      cannotEdit: "Once this coupon is claimed, you cannot edit or delete it."
    },

    pagination: {
      prev: "Prev",
      next: "Next"
    },

    search: {
      placeholder: "Search coupons..."
    },

    common: {
      loading: "Loading...",
      error: "Something went wrong.",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      language: "Language",
      saving: "Saving...",
      backToCoupons: "Back to Coupons",
      notFoundTitle: "Coupon Not Found",
      notFoundMessage: "Sorry, the coupon you're looking for doesn't exist or has been removed."
    }
  },

  /* ================= HINDI (Natural Everyday Hindi) ================= */

  hi: {

    investors: {
browseTitle: "निवेशक खोजें",
sendRequest: "अनुरोध भेजें",
requestSent: "अनुरोध भेज दिया",
alreadyConnected: "जुड़े हुए हैं",
viewProfile: "प्रोफाइल देखें",
filterByRisk: "जोखिम से फ़िल्टर करें",
filterByType: "प्रकार से फ़िल्टर करें",
all: "सभी",
low: "कम",
medium: "मध्यम",
high: "अधिक",
expectedRoi: "अपेक्षित रिटर्न",
horizon: "निवेश अवधि",
industries: "पसंदीदा उद्योग",
noInvestors: "कोई निवेशक नहीं मिला",      
noConnections: "अभी कोई निवेशक कनेक्शन नहीं है",
browseToConnect: "कनेक्शन भेजने के लिए निवेशक खोजें",
connectionStatus: "कनेक्शन स्थिति",
investorName: "निवेशक का नाम",
investorType: "निवेशक प्रकार",
individual: "व्यक्तिगत",
company: "कंपनी",
investmentRange: "निवेश सीमा",
message: "संदेश",
connections: "कनेक्शन",    
  risk: "जोखिम",
  requested: "अनुरोध किया",
  decline: "अस्वीकार",
  accept: "स्वीकार",
  openChat: "चैट खोलें",
  awaitingResponse: "प्रतीक्षा में",
  declined: "अस्वीकृत",
},

    performanceChart: "कूपन प्रदर्शन",
claims: "क्लेम",
redeemed: "उपयोग",

    analytics: {
  title: "कूपन रिपोर्ट",

  totalCoupons: "कुल उपलब्ध कूपन",
  totalClaims: "कुल क्लेम किए गए कूपन",
  totalRedemptions: "कुल उपयोग किए गए कूपन",

  claimsChart: "समय के अनुसार क्लेम",
  performanceChart: "कूपन प्रदर्शन",

  usersClaimed: "जिन उपयोगकर्ताओं ने क्लेम किया",
  usersRedeemed: "जिन उपयोगकर्ताओं ने उपयोग किया",

  loading: "रिपोर्ट लोड हो रही है..."
},

    scanner: {
  title: "QR कोड स्कैनर",
  start: "स्कैन शुरू करें",
  stop: "स्कैन बंद करें",
  instruction: "QR कोड को फ्रेम के अंदर रखें",

  validUntil: "मान्य समय",
  couponType: "कूपन प्रकार",
  redeemAtStore: "दुकान पर उपयोग",

  status: "स्थिति",
  alreadyRedeemed: "पहले ही उपयोग किया गया",

  userDetails: "उपयोगकर्ता विवरण",

  acceptCoupon: "कूपन स्वीकार करें",
  acceptSuccess: "कूपन सफलतापूर्वक स्वीकार किया गया",
  acceptError: "कूपन स्वीकार करने में त्रुटि",

  scannedResult: "स्कैन किया गया परिणाम",
  copy: "कॉपी करें",

  processing: "प्रोसेस हो रहा है...",

  instructionDesktop: "यह स्कैनर मोबाइल और डेस्कटॉप दोनों पर काम करता है।",
  allowCamera: "QR स्कैन करने के लिए कैमरा अनुमति दें।",

  cameraNotSupported: "आपका डिवाइस कैमरा सपोर्ट नहीं करता",
  permissionDenied: "कैमरा अनुमति अस्वीकृत",
  libraryNotLoaded: "स्कैनर लाइब्रेरी लोड नहीं हुई",
  scriptError: "QR स्कैनर लोड नहीं हो पाया"
},

    business: {
  title: "दुकान की जानकारी",
  subtitle: "अपनी दुकान की जानकारी देखें और अपडेट करें",

  overview: "दुकान का विवरण",
  contact: "संपर्क जानकारी",
  location: "दुकान का पता",
  edit: "दुकान की जानकारी बदलें",

  name: "दुकान का नाम",
  description: "विवरण",
  category: "श्रेणी",

  email: "ईमेल",
  phone: "फोन",
  website: "वेबसाइट",

  address: "पता",
  area: "इलाका",
  city: "शहर",
  state: "राज्य",
  postalCode: "पिन कोड",
  country: "देश",

  noData: "दुकान की जानकारी उपलब्ध नहीं है"
},

    sidebar: {
      vendorPortal: "विक्रेता पैनल",
      dashboard: "डैशबोर्ड",
      coupons: "कूपन",
      businessInfo: "दुकान की जानकारी",
      scanCoupon: "स्कैन करें",
      analytics: "रिपोर्ट",
      investors: "निवेशक",
      browseInvestors: "निवेशक खोजें",
      logout: "लॉग आउट",
      profile: "प्रोफाइल"
    },

    dashboard: {
      title: "डैशबोर्ड",
      totalCoupons: "कुल कूपन",
      couponsRedeemed: "इस्तेमाल हुए कूपन",
      totalClaims: "कुल क्लेम",
      activeCoupons: "चालू कूपन",
      recentCoupons: "नए कूपन",
      recentActivity: "हाल की गतिविधि",
      viewAllActivity: "सारी गतिविधि देखें",
      noActivity: "अभी कोई गतिविधि नहीं है",
      viewAll: "सब देखें",
      loading: "लोड हो रहा है...",
      errorTitle: "डेटा लोड नहीं हो पाया",
      tryAgain: "फिर से कोशिश करें",
      noData: "कोई कूपन नहीं मिला"
    },

    coupons: {
      addNewCoupon: "नया कूपन बनाएं",
      noCoupons: "अभी कोई कूपन नहीं है। पहला कूपन बनाइए।",
      claimed: "क्लेम हुआ",
      claims: "क्लेम",
      type: "प्रकार",
      redeemStore: "दुकान पर इस्तेमाल",
      valid: "मान्य",
      day: "दिन",
      days: "दिन",
      remaining: "बाकी",
      redeemed: "इस्तेमाल हुआ",
      disabled: "बंद",
      expired: "समाप्त",
      active: "चालू",

      title: "शीर्षक",
      description: "विवरण",
      startDate: "शुरू होने की तारीख और समय",
      endDate: "खत्म होने की तारीख और समय",
      maxClaims: "ज्यादा से ज्यादा क्लेम",

      createCoupon: "कूपन बनाएं",
      editCoupon: "कूपन बदलें",
      updateCoupon: "कूपन अपडेट करें",

      confirmDeletion: "कूपन हटाने की पुष्टि",
      deleteWarning: "क्या आप सच में यह कूपन हटाना चाहते हैं?",
      deleteCoupon: "कूपन हटाएं",
      deleting: "हटाया जा रहा है...",

      originalTimes: "पुराने कूपन का समय",
      start: "शुरू",
      end: "खत्म",
      note: "ध्यान दें",
      important: "जरूरी",

      futureDates: "सिर्फ आगे की तारीख और समय ही चुन सकते हैं।",
      unlimited: "अनलिमिटेड के लिए खाली छोड़ें",
      cannotEdit: "अगर कूपन क्लेम हो गया तो उसे बदल या हटा नहीं सकते।"
    },

    pagination: {
      prev: "पिछला",
      next: "अगला"
    },

    search: {
      placeholder: "कूपन खोजें..."
    },

    common: {
      loading: "लोड हो रहा है...",
      error: "कुछ गड़बड़ हो गई",
      save: "सेव करें",
      cancel: "रद्द करें",
      edit: "बदलें",
      delete: "हटाएं",
      view: "देखें",
      language: "भाषा",
      saving: "सेव हो रहा है...",
      backToCoupons: "कूपन सूची पर जाएं",
      notFoundTitle: "कूपन नहीं मिला",
      notFoundMessage: "यह कूपन मौजूद नहीं है या हटा दिया गया है।"
    }
  },

  /* ================= MARATHI (Natural Marathi) ================= */

  mr: {

    investors: {
browseTitle: "गुंतवणूकदार शोधा",
sendRequest: "विनंती पाठवा",
requestSent: "विनंती पाठवली",
alreadyConnected: "जोडलेले आहे",
viewProfile: "प्रोफाइल पाहा",
filterByRisk: "जोखमीनुसार फिल्टर करा",
filterByType: "प्रकारानुसार फिल्टर करा",
all: "सर्व",
low: "कमी",
medium: "मध्यम",
high: "जास्त",
expectedRoi: "अपेक्षित परतावा",
horizon: "गुंतवणूक कालावधी",
industries: "पसंतीचे उद्योग",
noInvestors: "गुंतवणूकदार सापडले नाही",      
noConnections: "अजून कोणतेही गुंतवणूकदार कनेक्शन नाही",
browseToConnect: "कनेक्शन पाठवण्यासाठी गुंतवणूकदार शोधा",
connectionStatus: "कनेक्शन स्थिती",
investorName: "गुंतवणूकदाराचे नाव",
investorType: "गुंतवणूकदार प्रकार",
individual: "वैयक्तिक",
company: "कंपनी",
investmentRange: "गुंतवणूक मर्यादा",
message: "संदेश",
connections: "कनेक्शन",    
  risk: "जोखीम",
  requested: "विनंती केली",
  decline: "नकार द्या",
  accept: "स्वीकारा",
  openChat: "चॅट उघडा",
  awaitingResponse: "प्रतीक्षेत",
  declined: "नाकारले",
},

    
    performanceChart: "कूपन कामगिरी",
claims: "क्लेम",
redeemed: "वापर",

    analytics: {
  title: "कूपन विश्लेषण",

  totalCoupons: "एकूण उपलब्ध कूपन",
  totalClaims: "एकूण क्लेम",
  totalRedemptions: "एकूण वापरलेले कूपन",

  claimsChart: "वेळेनुसार क्लेम",
  performanceChart: "कूपन कामगिरी",

  usersClaimed: "कूपन क्लेम करणारे वापरकर्ते",
  usersRedeemed: "कूपन वापरणारे वापरकर्ते",

  loading: "विश्लेषण लोड होत आहे..."
},

    scanner: {
  title: "QR कोड स्कॅनर",
  start: "स्कॅन सुरू करा",
  stop: "स्कॅन थांबवा",
  instruction: "QR कोड फ्रेममध्ये ठेवा",

  validUntil: "वैध तारीख",
  couponType: "कूपन प्रकार",
  redeemAtStore: "दुकानात वापरा",

  status: "स्थिती",
  alreadyRedeemed: "आधीच वापरले आहे",

  userDetails: "वापरकर्ता तपशील",

  acceptCoupon: "कूपन स्वीकारा",
  acceptSuccess: "कूपन यशस्वीपणे स्वीकारले",
  acceptError: "कूपन स्वीकारताना त्रुटी",

  scannedResult: "स्कॅन केलेला परिणाम",
  copy: "कॉपी करा",

  processing: "प्रक्रिया सुरू आहे...",

  instructionDesktop: "हा स्कॅनर मोबाईल आणि डेस्कटॉप दोन्हीवर चालतो.",
  allowCamera: "QR स्कॅन करण्यासाठी कॅमेरा परवानगी द्या.",

  cameraNotSupported: "तुमचे डिव्हाइस कॅमेरा सपोर्ट करत नाही",
  permissionDenied: "कॅमेरा परवानगी नाकारली",
  libraryNotLoaded: "स्कॅनर लायब्ररी लोड झाली नाही",
  scriptError: "QR स्कॅनर लोड करण्यात अयशस्वी"
},

    business: {
  title: "दुकान माहिती",
  subtitle: "तुमच्या दुकानाची माहिती पाहा आणि अपडेट करा",

  overview: "दुकान तपशील",
  contact: "संपर्क माहिती",
  location: "दुकानाचा पत्ता",
  edit: "दुकान माहिती बदला",

  name: "दुकानाचे नाव",
  description: "माहिती",
  category: "प्रकार",

  email: "ईमेल",
  phone: "फोन",
  website: "वेबसाइट",

  address: "पत्ता",
  area: "भाग",
  city: "शहर",
  state: "राज्य",
  postalCode: "पिन कोड",
  country: "देश",

  noData: "दुकानाची माहिती उपलब्ध नाही"
},

    sidebar: {
      vendorPortal: "विक्रेता पॅनल",
      dashboard: "डॅशबोर्ड",
      coupons: "कूपन",
      businessInfo: "दुकान माहिती",
      scanCoupon: "स्कॅन करा",
      analytics: "रिपोर्ट",
      investors: "गुंतवणूकदार",
      browseInvestors: "गुंतवणूकदार शोधा",
      logout: "लॉग आउट",
      profile: "प्रोफाइल"
    },

    dashboard: {
      title: "डॅशबोर्ड",
      totalCoupons: "एकूण कूपन",
      couponsRedeemed: "वापरलेले कूपन",
      totalClaims: "एकूण क्लेम",
      activeCoupons: "चालू कूपन",
      recentCoupons: "नवीन कूपन",
      recentActivity: "अलीकडची हालचाल",
      viewAllActivity: "सगळे पाहा",
      noActivity: "अजून काहीच हालचाल नाही",
      viewAll: "सगळे पाहा",
      loading: "लोड होत आहे...",
      errorTitle: "डेटा लोड झाला नाही",
      tryAgain: "पुन्हा प्रयत्न करा",
      noData: "कूपन सापडले नाही"
    },

    coupons: {
      addNewCoupon: "नवीन कूपन तयार करा",
      noCoupons: "अजून कूपन नाही. पहिले कूपन तयार करा.",
      claimed: "क्लेम झाले",
      claims: "क्लेम",
      type: "प्रकार",
      redeemStore: "दुकानात वापरा",
      valid: "वैध",
      day: "दिवस",
      days: "दिवस",
      remaining: "उरले",
      redeemed: "वापरले",
      disabled: "बंद",
      expired: "समाप्त",
      active: "चालू",

      title: "शीर्षक",
      description: "माहिती",
      startDate: "सुरू होण्याची तारीख व वेळ",
      endDate: "संपण्याची तारीख व वेळ",
      maxClaims: "जास्तीत जास्त क्लेम",

      createCoupon: "कूपन तयार करा",
      editCoupon: "कूपन बदला",
      updateCoupon: "कूपन अपडेट करा",

      confirmDeletion: "कूपन हटवायची खात्री",
      deleteWarning: "तुम्हाला खरंच हा कूपन हटवायचा आहे का?",
      deleteCoupon: "कूपन हटवा",
      deleting: "हटवले जात आहे...",

      originalTimes: "मूळ कूपन वेळ",
      start: "सुरू",
      end: "संपले",
      note: "टीप",
      important: "महत्त्वाचे",

      futureDates: "फक्त पुढच्या तारखा आणि वेळ निवडता येतील.",
      unlimited: "अमर्यादित ठेवायचे असेल तर रिकामे ठेवा",
      cannotEdit: "एकदा कूपन क्लेम झाले की ते बदलता येणार नाही."
    },

    pagination: {
      prev: "मागे",
      next: "पुढे"
    },

    search: {
      placeholder: "कूपन शोधा..."
    },

    common: {
      loading: "लोड होत आहे...",
      error: "काहीतरी चूक झाली",
      save: "सेव्ह करा",
      cancel: "रद्द करा",
      edit: "बदला",
      delete: "हटवा",
      view: "पाहा",
      language: "भाषा",
      saving: "सेव्ह होत आहे...",
      backToCoupons: "कूपन पेजवर जा",
      notFoundTitle: "कूपन सापडले नाही",
      notFoundMessage: "हा कूपन उपलब्ध नाही किंवा हटवला गेला आहे."
    }
  }

};

const LanguageContext = createContext(null);

const STORAGE_KEY = 'vendor_language';

export function LanguageProvider({ children }) {

  const [language, setLanguage] = useState('en');

  useEffect(() => {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved && translations[saved]) {
      setLanguage(saved);
      return;
    }

    // Auto detect browser language
    const browserLang = navigator.language.slice(0, 2);

    if (translations[browserLang]) {
      setLanguage(browserLang);
    }

  }, []);

  const changeLanguage = (lang) => {

    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem(STORAGE_KEY, lang);
    }

  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  return ctx;
}