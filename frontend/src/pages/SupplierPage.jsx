import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, ArrowUpDown, Star, Building2, MapPin, Phone, Mail, 
  UserCheck, ShieldCheck, Award, TrendingUp, Clock, AlertCircle, 
  CheckCircle2, Ban, Eye, Edit3, ShoppingCart, X, FileText, 
  ChevronDown, Sparkles, ExternalLink, Calendar, PackageCheck, Briefcase,
  SlidersHorizontal, Check, AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import '../pages/WelcomePage.css';

// ── 12 REALISTIC ENTERPRISE SCM SUPPLIERS DATASET ──────────────────────────────
const ENTERPRISE_SUPPLIERS = [
  {
    id: "SCM-VND-1001",
    name: "Dell Technologies India",
    category: "Electronics",
    city: "Bengaluru",
    state: "Karnataka",
    status: "ACTIVE",
    rating: 4.9,
    productsCount: 145,
    ordersCompleted: 412,
    activePOs: 8,
    avgDeliveryTime: "24-48 Hours",
    successRate: "99.2%",
    gst: "29AABCU9603R1ZM",
    estYear: 1996,
    contactPerson: "Vikramaditya Rao",
    designation: "VP of Enterprise Sales",
    email: "vikram.rao@dell.com",
    phone: "+91 80 2506 8000",
    performance: { delivery: 98, quality: 99, response: 95, reliability: 98 },
    banner: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
    description: "Leading supplier of enterprise laptops, desktops, servers, and IT infrastructure solutions for warehouse operations across India.",
    capacity: "15,000 Hardware Units / Month",
    warehouses: ["Bengaluru Hub A-01", "Mumbai Fulfillment Center", "Delhi NCR Depot"],
    paymentTerms: "Net 60 Days / Direct Bank Transfer (EDI)",
    certifications: ["ISO 9001:2015", "RoHS Compliant", "CE Certified", "Green IT Verified"],
    timeline: [
      { date: "Oct 2018", event: "Vendor Onboarded & Master Service Agreement signed" },
      { date: "Jan 2022", event: "Upgraded to Tier-1 Strategic SCM Partner status" },
      { date: "Jul 2025", event: "Annual ISO quality & compliance audit passed (Score: 99.4%)" }
    ],
    recentDeliveries: [
      { po: "PO-2026-8901", items: "50x Latitude 5440 Laptops", date: "01 Aug 2026", status: "Delivered On Time" },
      { po: "PO-2026-8742", items: "12x PowerEdge Servers", date: "24 Jul 2026", status: "Delivered On Time" },
      { po: "PO-2026-8511", items: "100x Dell 24-inch LED Displays", date: "15 Jul 2026", status: "Delivered On Time" }
    ]
  },
  {
    id: "SCM-VND-1002",
    name: "Logitech India",
    category: "Computer Accessories",
    city: "Mumbai",
    state: "Maharashtra",
    status: "ACTIVE",
    rating: 4.7,
    productsCount: 84,
    ordersCompleted: 310,
    activePOs: 5,
    avgDeliveryTime: "2-3 Days",
    successRate: "98.1%",
    gst: "27AABCL8102B1Z8",
    estYear: 2001,
    contactPerson: "Meera Kulkarni",
    designation: "Director B2B Channels",
    email: "mkulkarni@logitech.com",
    phone: "+91 22 4012 3000",
    performance: { delivery: 96, quality: 98, response: 94, reliability: 97 },
    banner: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    description: "Specialized in premium computer accessories including keyboards, mice, webcams, and conference room equipment.",
    capacity: "45,000 Accessory Units / Month",
    warehouses: ["Bhiwandi Hub (Mumbai)", "Bengaluru IT Hub"],
    paymentTerms: "Net 30 Days / Letter of Credit (LC)",
    certifications: ["ISO 9001:2015", "FCC Certified", "WEEE Compliant"],
    timeline: [
      { date: "Mar 2020", event: "Vendor Onboarding for Work-From-Home accessories suite" },
      { date: "Sep 2024", event: "Expanded supply contract for warehouse scanning hardware" }
    ],
    recentDeliveries: [
      { po: "PO-2026-8890", items: "200x Wireless MK270 Combo", date: "28 Jul 2026", status: "Delivered On Time" },
      { po: "PO-2026-8605", items: "15x Rally Video Conf HD Sets", date: "10 Jul 2026", status: "Delivered On Time" }
    ]
  },
  {
    id: "SCM-VND-1003",
    name: "Samsung Electronics",
    category: "Displays & Storage",
    city: "Gurgaon",
    state: "Haryana",
    status: "ACTIVE",
    rating: 4.8,
    productsCount: 210,
    ordersCompleted: 560,
    activePOs: 12,
    avgDeliveryTime: "1-2 Days",
    successRate: "99.5%",
    gst: "06AABCS4452P1ZX",
    estYear: 1995,
    contactPerson: "Anirudh Bhardwaj",
    designation: "Head of Display Solutions",
    email: "a.bhardwaj@samsung.com",
    phone: "+91 124 488 2000",
    performance: { delivery: 99, quality: 99, response: 97, reliability: 99 },
    banner: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    description: "Provides high-quality displays, SSD storage devices, and enterprise electronics for modern warehouse management.",
    capacity: "100,000 Units / Month",
    warehouses: ["Gurgaon National DC", "Chennai Port Logistics Hub", "Kolkata Regional Warehouse"],
    paymentTerms: "Net 45 Days / Automated Bank Draft",
    certifications: ["ISO 9001", "ISO 14001 Environmental", "Energy Star Tier-1"],
    timeline: [
      { date: "Jan 2017", event: "Initial contract for warehouse CCTV displays and SSDs" },
      { date: "Aug 2023", event: "Named Preferred Hardware Supplier of the Year" }
    ],
    recentDeliveries: [
      { po: "PO-2026-8950", items: "500x 1TB EVO NVMe SSDs", date: "02 Aug 2026", status: "Delivered On Time" },
      { po: "PO-2026-8801", items: "40x 55-inch UHD Command Screens", date: "29 Jul 2026", status: "Delivered On Time" }
    ]
  },
  {
    id: "SCM-VND-1004",
    name: "Kingston Technology",
    category: "RAM & SSD",
    city: "Pune",
    state: "Maharashtra",
    status: "ACTIVE",
    rating: 4.6,
    productsCount: 65,
    ordersCompleted: 280,
    activePOs: 4,
    avgDeliveryTime: "3-4 Days",
    successRate: "97.4%",
    gst: "27AABCK5543D1ZT",
    estYear: 2004,
    contactPerson: "Sanjay Deshmukh",
    designation: "National Account Manager",
    email: "sanjay_d@kingston.com",
    phone: "+91 20 6601 4500",
    performance: { delivery: 94, quality: 98, response: 91, reliability: 96 },
    banner: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
    description: "Global manufacturer of RAM modules, SSDs, and high-performance storage devices for business systems.",
    capacity: "80,000 Memory Modules / Month",
    warehouses: ["Pune MIDC Hub", "Hyderabad Distribution Point"],
    paymentTerms: "Net 30 Days / Wire Transfer",
    certifications: ["ISO 9001:2015", "RoHS", "JEDEC Compliant"],
    timeline: [
      { date: "Jun 2019", event: "Contracted for server RAM upgrading initiatives" }
    ],
    recentDeliveries: [
      { po: "PO-2026-8812", items: "300x 16GB DDR4 ECC RAM", date: "25 Jul 2026", status: "Delivered On Time" }
    ]
  },
  {
    id: "SCM-VND-1005",
    name: "Seagate Technology",
    category: "Storage",
    city: "Hyderabad",
    state: "Telangana",
    status: "ACTIVE",
    rating: 4.7,
    productsCount: 92,
    ordersCompleted: 340,
    activePOs: 6,
    avgDeliveryTime: "2-3 Days",
    successRate: "98.3%",
    gst: "36AABCS7712E1ZL",
    estYear: 2003,
    contactPerson: "Priya Nambiar",
    designation: "Enterprise Storage Director",
    email: "priya.nambiar@seagate.com",
    phone: "+91 40 6701 1000",
    performance: { delivery: 97, quality: 98, response: 94, reliability: 97 },
    banner: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&auto=format&fit=crop&q=80",
    description: "World-leading developer of high-capacity HDD hard drives, enterprise storage arrays, and cloud archiving hardwares.",
    capacity: "50,000 HDDs & SAS Drives / Month",
    warehouses: ["HITEC City Hyderabad Hub", "Bengaluru Tech Depot"],
    paymentTerms: "Net 60 Days / Automated EDI Invoice",
    certifications: ["ISO 9001", "FIPS 140-2 Security Verified"],
    timeline: [
      { date: "Aug 2018", event: "Selected as primary cold-storage backup drive supplier" }
    ],
    recentDeliveries: [
      { po: "PO-2026-8790", items: "100x Exos 16TB Enterprise HDDs", date: "22 Jul 2026", status: "Delivered On Time" }
    ]
  },
  {
    id: "SCM-VND-1006",
    name: "APC by Schneider Electric",
    category: "Power Backup",
    city: "Chennai",
    state: "Tamil Nadu",
    status: "ACTIVE",
    rating: 4.9,
    productsCount: 45,
    ordersCompleted: 195,
    activePOs: 3,
    avgDeliveryTime: "3-5 Days",
    successRate: "99.1%",
    gst: "33AABCS3321N1ZW",
    estYear: 1998,
    contactPerson: "Aravind Subramanian",
    designation: "VP Critical Power & Cool",
    email: "aravind.s@se.com",
    phone: "+91 44 3918 0000",
    performance: { delivery: 95, quality: 99, response: 98, reliability: 99 },
    banner: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    description: "Global benchmark for reliable uninterruptible power supplies (UPS), rack PDUs, and surge protection for data rooms.",
    capacity: "5,000 Heavy UPS Units / Month",
    warehouses: ["Oragadam Industrial Hub (Chennai)", "Delhi NCR Logistics Center"],
    paymentTerms: "Net 30 Days / Advance Letter of Credit",
    certifications: ["ISO 9001:2015", "UL Certified", "IEC Safety Standard"],
    timeline: [
      { date: "Nov 2019", event: "Supplied dual UPS grid for automated fulfillment warehouses" }
    ],
    recentDeliveries: [
      { po: "PO-2026-8854", items: "20x Smart-UPS SRT 3000VA", date: "27 Jul 2026", status: "Delivered On Time" }
    ]
  },
  {
    id: "SCM-VND-1007",
    name: "Godrej Storage Solutions",
    category: "Warehouse Equipment",
    city: "Mumbai",
    state: "Maharashtra",
    status: "ACTIVE",
    rating: 4.8,
    productsCount: 118,
    ordersCompleted: 420,
    activePOs: 7,
    avgDeliveryTime: "5-7 Days",
    successRate: "98.6%",
    gst: "27AABCG2210Q1ZR",
    estYear: 1993,
    contactPerson: "Rohan Godrej",
    designation: "Industrial Project Lead",
    email: "rohan.g@godrej.com",
    phone: "+91 22 6796 5656",
    performance: { delivery: 93, quality: 99, response: 95, reliability: 98 },
    banner: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
    description: "Industry-leading provider of warehouse racks, shelving systems, pallet storage, and industrial storage solutions.",
    capacity: "25,000 Tons Structural Racks / Month",
    warehouses: ["Vikhroli Industrial Complex (Mumbai)", "Talegaon Fabrication Hub"],
    paymentTerms: "50% Advance / 50% on Installation Approval",
    certifications: ["ISO 9001", "OHSAS 18001 Safety", "FEM Standard Compliant"],
    timeline: [
      { date: "May 2016", event: "Architected heavy-duty pallet systems for Zone A & B warehouses" }
    ],
    recentDeliveries: [
      { po: "PO-2026-8905", items: "50x High-Bay Pallet Rack Units", date: "30 Jul 2026", status: "Delivered On Time" }
    ]
  },
  {
    id: "SCM-VND-1008",
    name: "Uline Packaging",
    category: "Packaging Materials",
    city: "Ahmedabad",
    state: "Gujarat",
    status: "PENDING APPROVAL",
    rating: 4.4,
    productsCount: 350,
    ordersCompleted: 45,
    activePOs: 2,
    avgDeliveryTime: "4-6 Days",
    successRate: "95.8%",
    gst: "24AABCU8890C1ZP",
    estYear: 2011,
    contactPerson: "Hardik Patel",
    designation: "Logistics Supplies VP",
    email: "hpatel@uline.in",
    phone: "+91 79 2658 9900",
    performance: { delivery: 89, quality: 96, response: 90, reliability: 93 },
    banner: "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=600&auto=format&fit=crop&q=80",
    description: "Premier distributor of shipping boxes, protective bubble wraps, industrial strapping, and heavy-duty carton packaging.",
    capacity: "2,000,000 Carton Boxes / Month",
    warehouses: ["Sanand Industrial Hub (Ahmedabad)", "Kalyan Packaging Depot"],
    paymentTerms: "Net 30 Days / Direct Invoice",
    certifications: ["FSC Certified Paper", "ISO 9001"],
    timeline: [
      { date: "Jul 2026", event: "Submitted application for primary national carton supply contract" }
    ],
    recentDeliveries: [
      { po: "PO-2026-8700", items: "5,000x Heavy Duty Corrugated Boxes", date: "14 Jul 2026", status: "Delivered with 1-day delay" }
    ]
  },
  {
    id: "SCM-VND-1009",
    name: "Blue Dart Logistics Supplies",
    category: "Logistics Equipment",
    city: "Delhi",
    state: "Delhi NCR",
    status: "ACTIVE",
    rating: 4.7,
    productsCount: 78,
    ordersCompleted: 510,
    activePOs: 15,
    avgDeliveryTime: "24 Hours",
    successRate: "99.0%",
    gst: "07AABCB5511M1ZY",
    estYear: 1983,
    contactPerson: "Sunil Kher",
    designation: "National Operations Head",
    email: "sunilk@bluedart.com",
    phone: "+91 11 2371 4400",
    performance: { delivery: 99, quality: 97, response: 96, reliability: 98 },
    banner: "https://images.unsplash.com/photo-1566576912321-d58ddd7a603d?w=600&auto=format&fit=crop&q=80",
    description: "End-to-end logistics handling equipment, barcode scanners, thermal transport tags, and conveyor sorting fixtures.",
    capacity: "150,000 Logistics Supply Packs / Month",
    warehouses: ["Delhi Aviation Hub", "Mumbai Air Express Terminal", "Chennai Transit Depot"],
    paymentTerms: "Monthly Settlement / Net 15 Days",
    certifications: ["ISO 9001:2015", "IATA Accredited Supply Chain"],
    timeline: [
      { date: "Feb 2015", event: "Master Logistics & RFID tags provider across all India hubs" }
    ],
    recentDeliveries: [
      { po: "PO-2026-8966", items: "10,000x UHF RFID Tracking Labels", date: "03 Aug 2026", status: "Delivered On Time" }
    ]
  },
  {
    id: "SCM-VND-1010",
    name: "Hikvision India",
    category: "Security Systems",
    city: "Noida",
    state: "Uttar Pradesh",
    status: "INACTIVE",
    rating: 4.3,
    productsCount: 95,
    ordersCompleted: 120,
    activePOs: 0,
    avgDeliveryTime: "5-10 Days",
    successRate: "94.2%",
    gst: "09AABCH6634K1ZV",
    estYear: 2009,
    contactPerson: "Ankur Vashisht",
    designation: "Security Solutions Lead",
    email: "ankur.v@hikvisionindia.com",
    phone: "+91 120 450 6000",
    performance: { delivery: 86, quality: 94, response: 88, reliability: 91 },
    banner: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80",
    description: "Comprehensive surveillance hardwares including IP bullet cameras, NVR servers, facial access control, and alarm sensors.",
    capacity: "20,000 Camera Units / Month",
    warehouses: ["Noida SEZ Manufacturing Center"],
    paymentTerms: "Advance Bank TT",
    certifications: ["ISO 9001", "ONVIF Compliant"],
    timeline: [
      { date: "Sep 2021", event: "Supplied Phase-1 warehouse perimeter CCTV systems" },
      { date: "Jan 2026", event: "Contract placed on inactive hold pending security firmware audits" }
    ],
    recentDeliveries: [
      { po: "PO-2025-7412", items: "40x 4MP Night-Vision Cameras", date: "12 Dec 2025", status: "Completed" }
    ]
  },
  {
    id: "SCM-VND-1011",
    name: "HP Enterprise",
    category: "Printers & Servers",
    city: "Bengaluru",
    state: "Karnataka",
    status: "ACTIVE",
    rating: 4.8,
    productsCount: 132,
    ordersCompleted: 380,
    activePOs: 9,
    avgDeliveryTime: "1-2 Days",
    successRate: "98.9%",
    gst: "29AABCH4431R1ZO",
    estYear: 1997,
    contactPerson: "Preeti Shenoy",
    designation: "Enterprise Hardware VP",
    email: "preeti.shenoy@hpe.com",
    phone: "+91 80 2802 4000",
    performance: { delivery: 97, quality: 99, response: 96, reliability: 99 },
    banner: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=600&auto=format&fit=crop&q=80",
    description: "Enterprise-class rackmount blade servers, networking architectures, heavy-duty industrial label printers, and firmware.",
    capacity: "12,000 Enterprise Units / Month",
    warehouses: ["Bengaluru Tech Park Hub", "Hyderabad Regional DC"],
    paymentTerms: "Net 45 Days / Automated Direct Transfer",
    certifications: ["ISO 9001:2015", "Energy Star", "EPEAT Gold"],
    timeline: [
      { date: "Apr 2018", event: "Integrated warehouse automated barcode printing stations" }
    ],
    recentDeliveries: [
      { po: "PO-2026-8940", items: "25x Industrial Thermal Label Printers", date: "31 Jul 2026", status: "Delivered On Time" }
    ]
  },
  {
    id: "SCM-VND-1012",
    name: "Canon India",
    category: "Office Equipment",
    city: "Gurgaon",
    state: "Haryana",
    status: "BLACKLISTED",
    rating: 3.9,
    productsCount: 52,
    ordersCompleted: 34,
    activePOs: 0,
    avgDeliveryTime: "10+ Days",
    successRate: "87.4%",
    gst: "06AABCC8812D1Z6",
    estYear: 1997,
    contactPerson: "Manoranjan Singh",
    designation: "Commercial Account Mgr",
    email: "manoranjan.s@canon.co.in",
    phone: "+91 124 416 0000",
    performance: { delivery: 75, quality: 88, response: 70, reliability: 82 },
    banner: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80",
    description: "Commercial high-speed multi-function document printers, scanners, ink toners, and archival documentation hardware.",
    capacity: "5,000 Units / Month",
    warehouses: ["Gurgaon Warehouse Zone B"],
    paymentTerms: "Pre-payment Only",
    certifications: ["ISO 9001"],
    timeline: [
      { date: "Feb 2024", event: "Onboarded for central office copiers" },
      { date: "May 2026", event: "Blacklisted due to recurring SLA delivery violations and SLA breach" }
    ],
    recentDeliveries: [
      { po: "PO-2026-8105", items: "10x Heavy Duty Multi-Function Copiers", date: "15 Apr 2026", status: "Severely Delayed (14 days)" }
    ]
  }
];

// ── STATUS BADGE HELPER COMPONENT ──────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    ACTIVE: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    INACTIVE: "bg-gray-100 text-gray-700 border border-gray-300",
    "PENDING APPROVAL": "bg-amber-100 text-amber-800 border border-amber-300",
    BLACKLISTED: "bg-rose-100 text-rose-800 border border-rose-300"
  };

  const icons = {
    ACTIVE: <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-700 inline" />,
    INACTIVE: <AlertCircle className="w-3 h-3 mr-1 text-gray-600 inline" />,
    "PENDING APPROVAL": <Clock className="w-3 h-3 mr-1 text-amber-700 inline" />,
    BLACKLISTED: <Ban className="w-3 h-3 mr-1 text-rose-700 inline" />
  };

  const badgeClass = styles[status] || styles.ACTIVE;
  const icon = icons[status] || icons.ACTIVE;

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase flex items-center shadow-xs ${badgeClass}`}>
      {icon}
      {status}
    </span>
  );
};

// ── PROGRESS BAR COMPONENT ─────────────────────────────────────────────────────
const MetricProgress = ({ label, val }) => {
  let colorClass = "bg-emerald-500";
  if (val < 85) colorClass = "bg-rose-500";
  else if (val < 93) colorClass = "bg-amber-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-bold text-[#0A2B1E]">{val}%</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${val}%` }}
        />
      </div>
    </div>
  );
};

// ── MAIN SUPPLIERS ENTERPRISE SCM DASHBOARD COMPONENT ──────────────────────────
export default function SupplierPage() {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Derive unique categories & cities
  const categories = useMemo(() => ['ALL', ...new Set(ENTERPRISE_SUPPLIERS.map(s => s.category))], []);
  const cities = useMemo(() => ['ALL', ...new Set(ENTERPRISE_SUPPLIERS.map(s => s.city))], []);
  const statuses = ['ALL', 'ACTIVE', 'PENDING APPROVAL', 'INACTIVE', 'BLACKLISTED'];

  // Filter and sort logic
  const filteredSuppliers = useMemo(() => {
    return ENTERPRISE_SUPPLIERS.filter(vendor => {
      const matchesSearch = searchTerm.trim() === '' || 
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCat = categoryFilter === 'ALL' || vendor.category === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || vendor.status === statusFilter;
      const matchesCity = cityFilter === 'ALL' || vendor.city === cityFilter;

      return matchesSearch && matchesCat && matchesStatus && matchesCity;
    }).sort((a, b) => {
      if (sortBy === 'RATING_DESC') return b.rating - a.rating;
      if (sortBy === 'RATING_ASC') return a.rating - b.rating;
      if (sortBy === 'PROD_DESC') return b.productsCount - a.productsCount;
      if (sortBy === 'PROD_ASC') return a.productsCount - b.productsCount;
      return 0;
    });
  }, [searchTerm, categoryFilter, statusFilter, cityFilter, sortBy]);

  // KPI calculations
  const totalSuppliers = ENTERPRISE_SUPPLIERS.length;
  const activeSuppliers = ENTERPRISE_SUPPLIERS.filter(s => s.status === 'ACTIVE').length;
  const pendingSuppliers = ENTERPRISE_SUPPLIERS.filter(s => s.status === 'PENDING APPROVAL').length;
  const totalProducts = ENTERPRISE_SUPPLIERS.reduce((acc, curr) => acc + curr.productsCount, 0);
  const totalActivePOs = ENTERPRISE_SUPPLIERS.reduce((acc, curr) => acc + curr.activePOs, 0);
  const avgRating = (ENTERPRISE_SUPPLIERS.reduce((acc, curr) => acc + curr.rating, 0) / totalSuppliers).toFixed(2);

  // Action handlers
  const handleEditSupplier = (supplier) => {
    toast.success(`Opening master SCM editor for ${supplier.name} (${supplier.id})`);
  };

  const handleCreatePO = (supplier) => {
    if (supplier.status === 'BLACKLISTED') {
      toast.error(`Cannot initiate Purchase Order! ${supplier.name} is BLACKLISTED.`);
      return;
    }
    toast.success(`Drafting new Purchase Order (PO) to ${supplier.name} (${supplier.category}).`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setCityFilter('ALL');
    setSortBy('DEFAULT');
    toast.success("Filters reset to default");
  };

  return (
    <div className="welcome-page" style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      {/* ── TOP HEADER ──────────────────────────────────────────────────────── */}
      <header className="welcome-header light-mode">
        <Link to="/" className="logo">FLOWSTOCK</Link>
        <nav className="nav-pill">
          <Link to="/">Home</Link>
          <Link to="/warehouses">Warehouses</Link>
          <Link to="/suppliers">Suppliers</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <Link to="/login" className="cart-btn label-text">Sign In</Link>
      </header>

      {/* ── HERO HERO BANNER ───────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--color-forest)',
        padding: '8rem 2rem 4rem 2rem',
        borderBottomLeftRadius: '3rem',
        borderBottomRightRadius: '3rem',
        textAlign: 'center',
        color: 'var(--color-cream)',
        boxShadow: '0 25px 50px rgba(1,71,46,0.25)',
      }}>
        <div className="max-w-6xl mx-auto">

          <h1 className="anton text-5xl md:text-6xl lg:text-7xl mb-4 text-[#C2D7B4]">
            SUPPLIER NETWORK
          </h1>
          <p className="max-w-2xl mx-auto text-emerald-100/80 text-sm md:text-base leading-relaxed mb-8">
            Real-time supply chain vendor governance inspired by Oracle SCM &amp; Amazon Vendor Central. Monitor vendor deliveries, SLA ratings, active purchase orders, and capacity across fulfillment hubs.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex bg-black/30 p-1.5 rounded-full border border-white/15 shadow-inner">
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'suppliers'
                  ? 'bg-[#C2D7B4] text-[#0A2B1E] shadow-lg scale-105'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              VENDOR DIRECTORY (12)
            </button>
            <button
              onClick={() => {
                setActiveTab('purchase-orders');
                toast.success("Viewing Active Network Purchase Orders");
              }}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'purchase-orders'
                  ? 'bg-[#C2D7B4] text-[#0A2B1E] shadow-lg scale-105'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              PURCHASE ORDERS ({totalActivePOs})
            </button>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT AREA ───────────────────────────────────────────────── */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── KPI STATISTICS BLOCK ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10 -mt-16 relative z-10">
          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Suppliers</span>
              <Building2 className="w-6 h-6 p-1 bg-emerald-100 text-[#0A2B1E] rounded-lg" />
            </div>
            <p className="anton text-3xl text-[#0A2B1E]">{totalSuppliers}</p>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 inline" /> 100% SCM Connected
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Partners</span>
              <CheckCircle2 className="w-6 h-6 p-1 bg-emerald-100 text-emerald-700 rounded-lg" />
            </div>
            <p className="anton text-3xl text-emerald-700">{activeSuppliers}</p>
            <span className="text-[11px] font-semibold text-gray-500 mt-1">
              Verified &amp; Shipping
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Review</span>
              <Clock className="w-6 h-6 p-1 bg-amber-100 text-amber-700 rounded-lg" />
            </div>
            <p className="anton text-3xl text-amber-600">{pendingSuppliers}</p>
            <span className="text-[11px] font-semibold text-amber-600 mt-1">
              Compliance Auditing
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Catalog Items</span>
              <PackageCheck className="w-6 h-6 p-1 bg-blue-100 text-blue-700 rounded-lg" />
            </div>
            <p className="anton text-3xl text-[#0A2B1E]">{totalProducts}</p>
            <span className="text-[11px] font-semibold text-gray-500 mt-1">
              Across 12 Divisions
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Open POs</span>
              <ShoppingCart className="w-6 h-6 p-1 bg-purple-100 text-purple-700 rounded-lg" />
            </div>
            <p className="anton text-3xl text-purple-700">{totalActivePOs}</p>
            <span className="text-[11px] font-semibold text-purple-600 mt-1">
              Inbound Delivery Tracked
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Rating</span>
              <Star className="w-6 h-6 p-1 bg-yellow-100 text-amber-500 fill-amber-400 rounded-lg" />
            </div>
            <p className="anton text-3xl text-stone-800">{avgRating} <span className="text-sm text-gray-400 font-sans">/5.0</span></p>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 inline text-amber-500" /> Tier-1 Benchmark
            </span>
          </div>
        </div>

        {activeTab === 'suppliers' ? (
          <>
            {/* ── SEARCH & FILTER CONTROLS BAR ───────────────────────────── */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                
                {/* Search box */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search supplier by name, vendor ID, city, or contact person..."
                    className="w-full pl-12 pr-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium text-[#0A2B1E]"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Category:</span>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-transparent font-bold text-xs text-[#0A2B1E] focus:outline-none cursor-pointer"
                    >
                      {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>)}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
                    <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-transparent font-bold text-xs text-[#0A2B1E] focus:outline-none cursor-pointer"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>)}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-bold text-gray-500 uppercase">City:</span>
                    <select
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="bg-transparent font-bold text-xs text-[#0A2B1E] focus:outline-none cursor-pointer"
                    >
                      {cities.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Cities' : c}</option>)}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 bg-emerald-50/70 px-3 py-2 rounded-xl border border-emerald-200">
                    <ArrowUpDown className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-emerald-800 uppercase">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent font-bold text-xs text-emerald-900 focus:outline-none cursor-pointer"
                    >
                      <option value="DEFAULT">Default Order</option>
                      <option value="RATING_DESC">Rating (High to Low)</option>
                      <option value="RATING_ASC">Rating (Low to High)</option>
                      <option value="PROD_DESC">Products (Most to Least)</option>
                      <option value="PROD_ASC">Products (Least to Most)</option>
                    </select>
                  </div>

                  {(searchTerm !== '' || categoryFilter !== 'ALL' || statusFilter !== 'ALL' || cityFilter !== 'ALL' || sortBy !== 'DEFAULT') && (
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-100 transition flex items-center gap-1 border border-rose-200"
                    >
                      <X className="w-3.5 h-3.5" /> Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── RESULTS HEADER & COUNT ──────────────────────────────────── */}
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-xl font-bold text-[#0A2B1E] tracking-wide flex items-center gap-2">
                Showing <span className="px-3 py-0.5 rounded-full bg-[#0A2B1E] text-white text-sm font-['Anton']">{filteredSuppliers.length}</span> of {totalSuppliers} Enterprise Suppliers
              </h2>
              <span className="text-xs font-semibold text-gray-500">
                ⚡ Real-time synchronization active • Click "View Details" for audit logs
              </span>
            </div>

            {/* ── RESPONSIVE 4-COLUMN CARDS GRID ──────────────────────────── */}
            {filteredSuppliers.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 shadow-xs my-10">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="anton text-2xl text-[#0A2B1E] mb-2">NO SUPPLIERS MATCH YOUR FILTERS</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
                  We couldn't find any enterprise vendors matching the keyword or filtering criteria selected above.
                </p>
                <button onClick={resetFilters} className="px-6 py-2.5 bg-[#0A2B1E] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-800 transition">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredSuppliers.map(vendor => (
                  <div
                    key={vendor.id}
                    className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5"
                  >
                    <div>
                      {/* TOP BANNER */}
                      <div className="relative h-36 bg-stone-900 overflow-hidden">
                        <img 
                          src={vendor.banner} 
                          alt={vendor.category} 
                          className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Top Overlays */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-1">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#C2D7B4] text-[10px] font-bold tracking-wider uppercase border border-white/10">
                            {vendor.category}
                          </span>
                          <StatusBadge status={vendor.status} />
                        </div>

                        {/* Supplier ID on banner */}
                        <div className="absolute bottom-3 right-3 text-[11px] font-mono font-bold text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs border border-white/15">
                          {vendor.id}
                        </div>
                      </div>

                      {/* COMPANY INFORMATION */}
                      <div className="px-5 pt-3 pb-4">
                        {/* Avatar & Title Row */}
                        <div className="flex items-center gap-3 -mt-9 mb-3 relative z-10">
                          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0A2B1E] to-emerald-800 text-white flex items-center justify-center font-['Anton'] text-lg border-4 border-white shadow-md shrink-0">
                            {vendor.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div className="pt-4 overflow-hidden">
                            <h3 className="font-['Anton'] text-lg text-[#0A2B1E] truncate leading-tight hover:text-emerald-700 transition">
                              {vendor.name}
                            </h3>
                            <p className="text-xs text-gray-500 font-semibold flex items-center mt-0.5">
                              <MapPin className="w-3 h-3 mr-1 text-emerald-600 shrink-0" /> {vendor.city}, {vendor.state}
                            </p>
                          </div>
                        </div>

                        {/* Short Description */}
                        <p className="text-xs text-gray-600 line-clamp-2 min-h-[36px] italic font-serif leading-relaxed">
                          "{vendor.description}"
                        </p>

                        {/* Meta Tags */}
                        <div className="flex justify-between items-center text-[11px] text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 my-3">
                          <span>Est: <strong className="text-[#0A2B1E]">{vendor.estYear}</strong></span>
                          <span>•</span>
                          <span className="font-mono">GST: <strong className="text-stone-700">{vendor.gst}</strong></span>
                        </div>

                        {/* BUSINESS INFORMATION MATRIX */}
                        <div className="grid grid-cols-3 gap-2 bg-[#F5F2EB]/60 rounded-xl p-3 border border-stone-200/80 mb-4">
                          <div className="text-center border-r border-stone-200 pr-1">
                            <div className="text-xs font-bold text-[#0A2B1E] flex items-center justify-center">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-400 mr-1" /> {vendor.rating}
                            </div>
                            <span className="text-[10px] text-stone-500 font-semibold uppercase">Rating</span>
                          </div>

                          <div className="text-center border-r border-stone-200 px-1">
                            <div className="text-xs font-bold text-[#0A2B1E]">{vendor.productsCount}</div>
                            <span className="text-[10px] text-stone-500 font-semibold uppercase">Products</span>
                          </div>

                          <div className="text-center pl-1">
                            <div className="text-xs font-bold text-purple-700">{vendor.activePOs} Open</div>
                            <span className="text-[10px] text-stone-500 font-semibold uppercase">{vendor.ordersCompleted} Done</span>
                          </div>

                          <div className="col-span-3 pt-2 mt-1 border-t border-stone-200/80 flex justify-between items-center text-[11px] text-stone-600 px-1">
                            <span>Avg Delivery: <strong className="text-stone-800">{vendor.avgDeliveryTime}</strong></span>
                            <span>SLA Success: <strong className="text-emerald-700">{vendor.successRate}</strong></span>
                          </div>
                        </div>

                        {/* CONTACT INFORMATION */}
                        <div className="text-xs bg-stone-50/80 p-3 rounded-xl border border-stone-200 mb-4 space-y-1.5">
                          <div className="flex items-center text-[#0A2B1E] font-bold">
                            <UserCheck className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                            <span className="truncate">{vendor.contactPerson}</span>
                            <span className="ml-auto text-[10px] font-normal text-gray-400 bg-white px-1.5 py-0.5 rounded border border-stone-200">{vendor.designation.split(' ')[0]}</span>
                          </div>
                          <div className="flex items-center text-gray-600 truncate">
                            <Mail className="w-3.5 h-3.5 mr-2 text-gray-400 shrink-0" />
                            <a href={`mailto:${vendor.email}`} className="truncate hover:text-emerald-700 transition">{vendor.email}</a>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-3.5 h-3.5 mr-2 text-gray-400 shrink-0" />
                            <span>{vendor.phone}</span>
                          </div>
                        </div>

                        {/* PERFORMANCE SECTION */}
                        <div className="space-y-2 pt-1 border-t border-stone-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Operational KPI Performance</p>
                          <MetricProgress label="Delivery Performance" val={vendor.performance.delivery} />
                          <MetricProgress label="Quality &amp; Compliance" val={vendor.performance.quality} />
                          <MetricProgress label="Response Time SLA" val={vendor.performance.response} />
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS TOOLBAR */}
                    <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSupplier(vendor)}
                          className="flex-1 py-2 px-3 bg-white hover:bg-stone-100 text-[#0A2B1E] font-bold text-xs uppercase tracking-wider rounded-xl border border-stone-300 transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-700" /> Details
                        </button>
                        <button
                          onClick={() => handleEditSupplier(vendor)}
                          className="py-2 px-3 bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs uppercase rounded-xl border border-stone-300 transition flex items-center justify-center shadow-xs"
                          title="Edit Supplier Profile"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleCreatePO(vendor)}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md ${
                          vendor.status === 'BLACKLISTED'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#0A2B1E] hover:bg-emerald-900 text-[#F5F2EB]'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4 text-[#C2D7B4]" />
                        Create Purchase Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* ── PURCHASE ORDERS TAB ─────────────────────────────────────────── */
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-4">
              <div>
                <h2 className="anton text-2xl text-[#0A2B1E]">ACTIVE PURCHASE ORDERS ({totalActivePOs})</h2>
                <p className="text-xs text-gray-500">Live feed of pending inbound hardware and packaging inventory shipments.</p>
              </div>
              <button
                onClick={() => setActiveTab('suppliers')}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider rounded-xl transition"
              >
                ← Return to Vendor Directory
              </button>
            </div>

            <div className="space-y-4">
              {ENTERPRISE_SUPPLIERS.flatMap(s => (s.recentDeliveries || []).map(po => ({ ...po, vendor: s }))).slice(0, 8).map((po, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-stone-200 hover:border-emerald-500 bg-stone-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 text-[#0A2B1E] rounded-xl font-bold font-mono text-xs">
                      {po.po}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0A2B1E]">{po.items}</h4>
                      <p className="text-xs text-gray-500">Vendor: <strong className="text-emerald-700">{po.vendor.name}</strong> • City: {po.vendor.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs font-mono text-gray-400">{po.date}</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                      {po.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── VIEW DETAILS ENTERPRISE MODAL ────────────────────────────────────── */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 text-[#0A2B1E] relative my-auto">
            
            {/* Modal Top Banner */}
            <div className="relative h-44 bg-stone-900">
              <img src={selectedSupplier.banner} alt="Vendor" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2B1E] via-black/40 to-transparent" />
              
              <button 
                onClick={() => setSelectedSupplier(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-end gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#C2D7B4] text-[#0A2B1E] flex items-center justify-center font-['Anton'] text-2xl border-4 border-white shadow-lg">
                    {selectedSupplier.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/20 text-[#C2D7B4] border border-white/30 mr-2">
                      {selectedSupplier.id}
                    </span>
                    <span className="text-xs text-emerald-200 font-semibold uppercase">{selectedSupplier.category}</span>
                    <h2 className="anton text-2xl sm:text-3xl text-white mt-1">{selectedSupplier.name}</h2>
                  </div>
                </div>
                <StatusBadge status={selectedSupplier.status} />
              </div>
            </div>

            {/* Modal Interior Body */}
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* 1. Company Profile & Description */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                  <Building2 className="w-4 h-4 mr-1 text-emerald-700 inline" /> Executive Profile &amp; Overview
                </h3>
                <p className="text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-sm leading-relaxed font-serif italic">
                  "{selectedSupplier.description}"
                </p>
              </div>

              {/* 2. Key Operational Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#F5F2EB] p-4 rounded-2xl border border-stone-300/50">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Monthly Capacity</span>
                  <p className="font-bold text-sm text-[#0A2B1E] mt-1">{selectedSupplier.capacity}</p>
                </div>
                <div className="bg-[#F5F2EB] p-4 rounded-2xl border border-stone-300/50">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Payment Terms</span>
                  <p className="font-bold text-sm text-stone-800 mt-1">{selectedSupplier.paymentTerms}</p>
                </div>
                <div className="bg-[#F5F2EB] p-4 rounded-2xl border border-stone-300/50">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Fulfillment SLA</span>
                  <p className="font-bold text-sm text-emerald-700 mt-1">{selectedSupplier.avgDeliveryTime} ({selectedSupplier.successRate})</p>
                </div>
                <div className="bg-[#F5F2EB] p-4 rounded-2xl border border-stone-300/50">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Tax &amp; Legal Registration</span>
                  <p className="font-mono font-bold text-xs text-stone-700 mt-1">GSTIN: {selectedSupplier.gst}</p>
                </div>
              </div>

              {/* 3. Certifications & Warehouses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1 text-emerald-700 inline" /> Active ISO Certifications &amp; Standards
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSupplier.certifications.map((cert, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center shadow-xs">
                        <Award className="w-3.5 h-3.5 mr-1.5 text-amber-500 shrink-0" /> {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-emerald-700 inline" /> Registered Distribution Warehouses
                  </h4>
                  <div className="space-y-2">
                    {selectedSupplier.warehouses.map((wh, idx) => (
                      <div key={idx} className="flex items-center text-xs text-stone-700 font-semibold bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shrink-0" /> {wh}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Recent PO Deliveries */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                  <PackageCheck className="w-4 h-4 mr-1 text-emerald-700 inline" /> Recent Supply Fulfillment Logs
                </h4>
                <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 border-b border-stone-200 font-bold text-stone-700 uppercase">
                      <tr>
                        <th className="py-2.5 px-4">PO Number</th>
                        <th className="py-2.5 px-4">Hardware / Products Supplied</th>
                        <th className="py-2.5 px-4">Dispatch Date</th>
                        <th className="py-2.5 px-4">Audit Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {selectedSupplier.recentDeliveries.map((del, idx) => (
                        <tr key={idx} className="hover:bg-stone-50 transition">
                          <td className="py-3 px-4 font-mono font-bold text-[#0A2B1E]">{del.po}</td>
                          <td className="py-3 px-4 font-semibold">{del.items}</td>
                          <td className="py-3 px-4 text-gray-500">{del.date}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {del.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. Supplier Relationship Timeline */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-emerald-700 inline" /> Strategic Partnership Timeline
                </h4>
                <div className="border-l-2 border-emerald-500 ml-3 pl-4 space-y-4 my-2">
                  {selectedSupplier.timeline.map((event, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-200" />
                      <span className="text-[11px] font-bold font-mono text-gray-400 uppercase">{event.date}</span>
                      <p className="text-xs font-bold text-[#0A2B1E] mt-0.5">{event.event}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                  <Phone className="w-4 h-4 text-emerald-600" /> Direct Account Executive: <strong className="text-stone-800">{selectedSupplier.contactPerson}</strong> ({selectedSupplier.phone})
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedSupplier(null)}
                    className="px-6 py-2.5 rounded-xl border border-stone-300 font-bold text-xs uppercase hover:bg-stone-100 transition w-full sm:w-auto"
                  >
                    Close Modal
                  </button>
                  <button
                    onClick={() => {
                      handleCreatePO(selectedSupplier);
                      setSelectedSupplier(null);
                    }}
                    className="px-6 py-2.5 bg-[#0A2B1E] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
                  >
                    <ShoppingCart className="w-4 h-4 text-[#C2D7B4]" /> Create PO
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
