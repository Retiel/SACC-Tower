/**
 * SACC Tower - Documentation File Connector
 * ==========================================
 * 
 * This configuration file registers all external documentation sources
 * that the Documentation interface can connect to. Sources can be:
 * - Public (no authentication required)
 * - Registration-required (needs credentials or API key)
 * 
 * HOW TO CONFIGURE:
 * 1. Add new sources to the appropriate category array
 * 2. Set `authRequired: true` for sites needing login/registration
 * 3. Provide `authConfig` with the authentication method details
 * 4. Set `enabled: true/false` to activate/deactivate sources
 * 5. Provide `owner` with name and description of the source entity
 * 
 * SUPPORTED AUTH TYPES:
 * - "none"        : Public access, no authentication
 * - "api_key"     : Requires API key in header or query param
 * - "oauth2"      : OAuth 2.0 flow (client credentials or auth code)
 * - "basic"       : HTTP Basic Authentication (username/password)
 * - "token"       : Bearer token authentication
 * - "session"     : Browser session / cookie-based (login redirect)
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AuthConfig {
  type: "none" | "api_key" | "oauth2" | "basic" | "token" | "session";
  keyName?: string;
  keyValue?: string;
  tokenUrl?: string;
  clientId?: string;
  loginUrl?: string;
  registrationNotes?: string;
}

export interface SourceOwner {
  name: string;
  description: string;
}

export interface ExternalSource {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  category: SourceCategory;
  tags: string[];
  enabled: boolean;
  authRequired: boolean;
  authConfig: AuthConfig;
  /** Owner entity of this documentation source */
  owner: SourceOwner;
  /** Specific documentation paths relative to baseUrl */
  paths?: DocumentationPath[];
  /** Last verified date (ISO format) */
  lastVerified?: string;
  /** Priority for display ordering (1 = highest) */
  priority?: number;
}

export interface DocumentationPath {
  path: string;
  title: string;
  description: string;
}

export type SourceCategory =
  | "servicenow_official"
  | "servicenow_community"
  | "api_reference"
  | "developer_tools"
  | "academic_research"
  | "industry_standards"
  | "third_party_integrations"
  | "general_reference";

// ============================================================================
// SERVICENOW OFFICIAL DOCUMENTATION
// ============================================================================

const SN_OWNER: SourceOwner = {
  name: "ServiceNow, Inc.",
  description: "ServiceNow is a US-based enterprise cloud computing company headquartered in Santa Clara, California. Founded in 2003, it provides digital workflow platforms that manage and automate IT services, operations, and business processes for over 8,100 enterprise customers globally.",
};

const SERVICENOW_OFFICIAL: ExternalSource[] = [
  {
    id: "sn-docs-main",
    name: "ServiceNow Product Documentation",
    description: "Official ServiceNow platform documentation covering all products, modules, and release notes",
    baseUrl: "https://docs.servicenow.com",
    category: "servicenow_official",
    tags: ["platform", "modules", "configuration", "administration"],
    enabled: true,
    authRequired: false,
    authConfig: { type: "none" },
    owner: SN_OWNER,
    lastVerified: "2024-01-15",
    priority: 1,
    paths: [
      { path: "/bundle/washingtondc-release-notes/page/release-notes.html", title: "Washington DC Release Notes", description: "Latest release notes and new features" },
      { path: "/bundle/washingtondc-platform-security/page/platform-security.html", title: "Platform Security", description: "Security configuration and best practices" },
      { path: "/bundle/washingtondc-application-development/page/app-development.html", title: "Application Development", description: "Scoped application development guide" },
      { path: "/bundle/washingtondc-it-service-management/page/itsm.html", title: "IT Service Management", description: "ITSM module configuration and processes" },
    ],
  },
  {
    id: "sn-developer",
    name: "ServiceNow Developer Portal",
    description: "Developer documentation, API references, tutorials, and learning paths for ServiceNow development",
    baseUrl: "https://developer.servicenow.com",
    category: "servicenow_official",
    tags: ["api", "development", "tutorials", "scripting", "rest"],
    enabled: true,
    authRequired: true,
    authConfig: { type: "session", loginUrl: "https://developer.servicenow.com/connect.do", registrationNotes: "Free developer account required." },
    owner: SN_OWNER,
    lastVerified: "2024-01-15",
    priority: 1,
    paths: [
      { path: "/dev.do#!/reference/api/washingtondc/server/c_GlideRecordAPI", title: "GlideRecord API", description: "Server-side GlideRecord class reference" },
      { path: "/dev.do#!/reference/api/washingtondc/server/c_GlideSystemAPI", title: "GlideSystem API", description: "gs object API reference" },
      { path: "/dev.do#!/reference/api/washingtondc/rest/c_TableAPI", title: "Table REST API", description: "RESTful Table API reference" },
    ],
  },
  {
    id: "sn-developer-blog",
    name: "ServiceNow Developer Blog",
    description: "Technical articles, best practices, and tutorials from the ServiceNow developer team",
    baseUrl: "https://developer.servicenow.com/blog.do",
    category: "servicenow_official",
    tags: ["blog", "tutorials", "best-practices", "updates"],
    enabled: true,
    authRequired: false,
    authConfig: { type: "none" },
    owner: SN_OWNER,
    lastVerified: "2024-01-15",
    priority: 2,
  },
  {
    id: "sn-api-docs",
    name: "ServiceNow REST API Explorer",
    description: "Interactive REST API documentation and testing tool",
    baseUrl: "https://docs.servicenow.com/bundle/washingtondc-api-reference/page/build/applications/concept/api-rest.html",
    category: "api_reference",
    tags: ["rest", "api", "integration", "scripted-rest"],
    enabled: true,
    authRequired: false,
    authConfig: { type: "none" },
    owner: SN_OWNER,
    lastVerified: "2024-01-15",
    priority: 1,
  },
  {
    id: "sn-now-learning",
    name: "ServiceNow Now Learning",
    description: "Official training platform with courses, certifications, and hands-on labs",
    baseUrl: "https://nowlearning.servicenow.com",
    category: "servicenow_official",
    tags: ["training", "certification", "labs", "courses"],
    enabled: true,
    authRequired: true,
    authConfig: { type: "session", loginUrl: "https://nowlearning.servicenow.com/lxp", registrationNotes: "ServiceNow account required." },
    owner: SN_OWNER,
    lastVerified: "2024-01-15",
    priority: 2,
  },
  {
    id: "sn-store",
    name: "ServiceNow Store",
    description: "Application marketplace with certified integrations, plugins, and applications",
    baseUrl: "https://store.servicenow.com",
    category: "servicenow_official",
    tags: ["plugins", "integrations", "marketplace", "apps"],
    enabled: true,
    authRequired: true,
    authConfig: { type: "session", loginUrl: "https://store.servicenow.com/sn_appstore_store.do", registrationNotes: "HI account required." },
    owner: SN_OWNER,
    lastVerified: "2024-01-15",
    priority: 3,
  },
  {
    id: "sn-support",
    name: "ServiceNow Technical Support (HI)",
    description: "Knowledge articles, known errors, and support resources from ServiceNow Support",
    baseUrl: "https://support.servicenow.com",
    category: "servicenow_official",
    tags: ["support", "known-errors", "patches", "troubleshooting"],
    enabled: true,
    authRequired: true,
    authConfig: { type: "session", loginUrl: "https://support.servicenow.com/now", registrationNotes: "HI portal account required." },
    owner: SN_OWNER,
    lastVerified: "2024-01-15",
    priority: 2,
  },
];

// ============================================================================
// SERVICENOW COMMUNITY
// ============================================================================

const SERVICENOW_COMMUNITY: ExternalSource[] = [
  { id: "sn-community", name: "ServiceNow Community", description: "Community forums, knowledge sharing, user groups, and peer-to-peer support", baseUrl: "https://www.servicenow.com/community", category: "servicenow_community", tags: ["community", "forums", "q&a"], enabled: true, authRequired: true, authConfig: { type: "session", loginUrl: "https://www.servicenow.com/community/user/login", registrationNotes: "Free community account." }, owner: SN_OWNER, lastVerified: "2024-01-15", priority: 2 },
  { id: "sn-share", name: "ServiceNow Share", description: "Community-contributed applications, scripts, and update sets for download", baseUrl: "https://developer.servicenow.com/connect.do#!/share", category: "servicenow_community", tags: ["share", "scripts", "update-sets"], enabled: true, authRequired: true, authConfig: { type: "session", loginUrl: "https://developer.servicenow.com/connect.do", registrationNotes: "Developer account required." }, owner: SN_OWNER, lastVerified: "2024-01-15", priority: 3 },
];

// ============================================================================
// DEVELOPER TOOLS & SPECIFICATIONS
// ============================================================================

const DEVELOPER_TOOLS: ExternalSource[] = [
  { id: "mdn-web-docs", name: "MDN Web Docs", description: "Comprehensive web technology documentation (HTML, CSS, JavaScript)", baseUrl: "https://developer.mozilla.org", category: "developer_tools", tags: ["javascript", "html", "css", "web-standards"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Mozilla Foundation", description: "The Mozilla Foundation is a US non-profit organization that exists to support the open internet. It is the sole shareholder of Mozilla Corporation which develops the Firefox browser. Mozilla champions internet health, open-source software, and web standards education." }, lastVerified: "2024-01-15", priority: 2, paths: [{ path: "/en-US/docs/Web/JavaScript/Reference", title: "JavaScript Reference", description: "Complete JS language reference" }, { path: "/en-US/docs/Web/API", title: "Web APIs", description: "Browser API reference" }] },
  { id: "ecma-spec", name: "ECMAScript Language Specification", description: "Official JavaScript/ECMAScript language specification (ECMA-262)", baseUrl: "https://tc39.es/ecma262", category: "industry_standards", tags: ["javascript", "ecmascript", "specification"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Ecma International", description: "Ecma International is a standards organization for information and communication systems, founded in 1961 in Geneva, Switzerland. It develops standards for programming languages (ECMAScript/JavaScript), file systems, and communication protocols used worldwide." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "w3c-specs", name: "W3C Technical Reports", description: "World Wide Web Consortium standards (ARIA, HTML, CSS, XML)", baseUrl: "https://www.w3.org/TR", category: "industry_standards", tags: ["w3c", "standards", "accessibility", "html", "css"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "World Wide Web Consortium (W3C)", description: "The World Wide Web Consortium is the main international standards organization for the World Wide Web, founded by Tim Berners-Lee in 1994. W3C develops open standards (HTML, CSS, ARIA, XML) to ensure long-term web interoperability and accessibility." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "owasp", name: "OWASP Foundation", description: "Open Web Application Security Project - security best practices and testing guides", baseUrl: "https://owasp.org", category: "industry_standards", tags: ["security", "vulnerability", "testing"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "OWASP Foundation", description: "The Open Worldwide Application Security Project (OWASP) is a nonprofit foundation improving software security. Established in 2001, it provides free tools, standards, and documentation including the widely-referenced OWASP Top 10 web application security risks." }, lastVerified: "2024-01-15", priority: 2, paths: [{ path: "/www-project-top-ten", title: "OWASP Top 10", description: "Top 10 web application security risks" }] },
  { id: "github-docs", name: "GitHub Documentation", description: "GitHub platform documentation for source control, CI/CD, and collaboration", baseUrl: "https://docs.github.com", category: "developer_tools", tags: ["git", "source-control", "ci-cd", "actions"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "GitHub, Inc. (Microsoft)", description: "GitHub is a developer platform for hosting, reviewing, and collaborating on code, acquired by Microsoft in 2018. With over 100 million developers, it is the world's largest source code hosting service, offering Git-based version control, CI/CD, and project management." }, lastVerified: "2024-01-15", priority: 3 },
];

// ============================================================================
// ACADEMIC & RESEARCH LIBRARIES
// ============================================================================

const ACADEMIC_RESEARCH: ExternalSource[] = [
  { id: "mit-libraries", name: "MIT Libraries", description: "Massachusetts Institute of Technology research library system", baseUrl: "https://libraries.mit.edu", category: "academic_research", tags: ["research", "academic", "computer-science"], enabled: true, authRequired: true, authConfig: { type: "session", loginUrl: "https://libraries.mit.edu/accounts", registrationNotes: "MIT affiliation required for full access." }, owner: { name: "Massachusetts Institute of Technology (MIT)", description: "MIT is a private research university in Cambridge, Massachusetts, founded in 1861. Consistently ranked among the world's top universities, MIT is renowned for engineering, computer science, and technology research with over 11,000 students and 1,000 faculty members." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "arxiv", name: "arXiv", description: "Open access archive for scientific papers in CS, AI, and mathematics", baseUrl: "https://arxiv.org", category: "academic_research", tags: ["research", "papers", "ai", "machine-learning"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Cornell University / arXiv.org", description: "arXiv is an open-access repository of electronic preprints, hosted by Cornell University since 2001. It hosts over 2.4 million scholarly articles in physics, mathematics, computer science, and related fields, serving as the primary pre-publication platform for scientific research." }, lastVerified: "2024-01-15", priority: 2, paths: [{ path: "/list/cs.SE/recent", title: "Software Engineering Papers", description: "Recent papers in software engineering" }, { path: "/list/cs.AI/recent", title: "AI Research Papers", description: "Recent AI papers" }] },
  { id: "ieee-xplore", name: "IEEE Xplore Digital Library", description: "IEEE/IET electronic library for technical standards and research publications", baseUrl: "https://ieeexplore.ieee.org", category: "academic_research", tags: ["ieee", "standards", "engineering"], enabled: true, authRequired: true, authConfig: { type: "session", loginUrl: "https://ieeexplore.ieee.org/servlet/Login", registrationNotes: "IEEE membership or institutional access required." }, owner: { name: "Institute of Electrical and Electronics Engineers (IEEE)", description: "IEEE is the world's largest technical professional organization dedicated to advancing technology. Founded in 1963, it has over 400,000 members in 160 countries and publishes approximately 200 peer-reviewed journals and 1,800+ annual conferences." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "acm-digital-library", name: "ACM Digital Library", description: "Computing research papers, proceedings, and magazines", baseUrl: "https://dl.acm.org", category: "academic_research", tags: ["acm", "computing", "research", "conferences"], enabled: true, authRequired: true, authConfig: { type: "session", loginUrl: "https://dl.acm.org/action/showLogin", registrationNotes: "ACM membership or institutional access required." }, owner: { name: "Association for Computing Machinery (ACM)", description: "ACM is the world's largest computing society, founded in 1947. It publishes prestigious journals and conferences (SIGCHI, SIGMOD, SIGGRAPH), awards the Turing Award, and maintains the ACM Digital Library with over 600,000 full-text articles." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "google-scholar", name: "Google Scholar", description: "Search engine for scholarly literature across disciplines", baseUrl: "https://scholar.google.com", category: "academic_research", tags: ["search", "papers", "citations"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Google LLC (Alphabet Inc.)", description: "Google is a multinational technology company specializing in search, cloud computing, and AI. Google Scholar, launched in 2004, indexes the full text of scholarly articles across formats and disciplines, providing citation analysis and access to academic research worldwide." }, lastVerified: "2024-01-15", priority: 2 },
  // --- EUROPEAN UNIVERSITIES ---
  { id: "eth-zurich-library", name: "ETH Zürich Research Collection", description: "Open access research publications in engineering, IT, and natural sciences", baseUrl: "https://www.research-collection.ethz.ch", category: "academic_research", tags: ["research", "engineering", "computer-science", "switzerland"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "ETH Zürich (Swiss Federal Institute of Technology)", description: "ETH Zürich is a public research university in Zürich, Switzerland, founded in 1855. Ranked consistently among the world's top 10 universities, it has produced 22 Nobel Prize laureates and is renowned for engineering, computer science, physics, and mathematics research." }, lastVerified: "2024-01-15", priority: 2 },
  { id: "tu-munich", name: "TU Munich - mediaTUM", description: "Engineering, informatics, and industrial technology research repository", baseUrl: "https://mediatum.ub.tum.de", category: "academic_research", tags: ["research", "informatics", "engineering", "germany"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Technical University of Munich (TUM)", description: "TUM is one of Europe's leading technical universities, founded in 1868 in Munich, Germany. With over 50,000 students, it excels in engineering, computer science, natural sciences, and life sciences, consistently ranked as Germany's top technical university." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "tu-delft-repository", name: "TU Delft Repository", description: "Systems engineering, software architecture, and industrial design research", baseUrl: "https://repository.tudelft.nl", category: "academic_research", tags: ["research", "systems-engineering", "software", "netherlands"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Delft University of Technology (TU Delft)", description: "TU Delft is the oldest and largest public technical university in the Netherlands, founded in 1842. It is internationally renowned for engineering, architecture, and technology research, with approximately 27,000 students and world-leading programs in aerospace, civil engineering, and computer science." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "imperial-college-spiral", name: "Imperial College London - Spiral", description: "Computing, engineering, and data science open access repository", baseUrl: "https://spiral.imperial.ac.uk", category: "academic_research", tags: ["research", "computing", "data-science", "uk"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Imperial College London", description: "Imperial College London is a public research university focused exclusively on science, engineering, medicine, and business. Founded in 1907, it is consistently ranked in the global top 10 for STEM subjects with approximately 22,000 students from 140+ countries." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "cambridge-repository", name: "University of Cambridge - Apollo", description: "Research papers in computer science and information technology", baseUrl: "https://www.repository.cam.ac.uk", category: "academic_research", tags: ["research", "computer-science", "information-technology", "uk"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "University of Cambridge", description: "The University of Cambridge is a collegiate public research university in Cambridge, England, founded in 1209. It is one of the world's oldest and most prestigious universities, with 121 Nobel Prize affiliates, leading in mathematics, computer science, and engineering." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "oxford-ora", name: "University of Oxford - ORA", description: "Publications in computer science, engineering science, and information systems", baseUrl: "https://ora.ox.ac.uk", category: "academic_research", tags: ["research", "computer-science", "engineering", "uk"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "University of Oxford", description: "The University of Oxford is the oldest university in the English-speaking world, with evidence of teaching as early as 1096. Located in Oxford, England, it is a world-leading research institution with over 24,000 students, renowned for humanities, sciences, and technology." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "epfl-infoscience", name: "EPFL Infoscience", description: "Distributed systems, AI, and software engineering publications", baseUrl: "https://infoscience.epfl.ch", category: "academic_research", tags: ["research", "distributed-systems", "ai", "switzerland"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "École Polytechnique Fédérale de Lausanne (EPFL)", description: "EPFL is a research institute and university in Lausanne, Switzerland, specializing in natural sciences and engineering. Founded in 1969, it is one of Europe's most vibrant and cosmopolitan science and technology institutions with over 12,000 students from 120+ nationalities." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "kth-diva", name: "KTH Royal Institute of Technology - DiVA", description: "IT, industrial technology, and systems architecture research", baseUrl: "https://kth.diva-portal.org", category: "academic_research", tags: ["research", "industrial-technology", "systems", "sweden"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "KTH Royal Institute of Technology", description: "KTH is Sweden's largest and oldest technical university, founded in 1827 in Stockholm. With around 13,000 full-time students, KTH is renowned for engineering, IT, architecture, and industrial technology research, contributing to one-third of Sweden's technical research output." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "politecnico-milano", name: "Politecnico di Milano - RE.PUBLIC", description: "Industrial engineering, information technology, and automation research", baseUrl: "https://re.public.polimi.it", category: "academic_research", tags: ["research", "industrial-engineering", "automation", "italy"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Politecnico di Milano", description: "The Polytechnic University of Milan (Italian: Politecnico di Milano, abbreviated as Polimi) is the largest public technical university in Italy, with about 48,000 enrolled students. The university offers undergraduate, graduate, and higher education courses in engineering, architecture, and design." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "tu-berlin-depositonce", name: "TU Berlin - DepositOnce", description: "Industrial informatics, process automation, and IT security research", baseUrl: "https://depositonce.tu-berlin.de", category: "academic_research", tags: ["research", "informatics", "automation", "it-security", "germany"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Technical University of Berlin (TU Berlin)", description: "TU Berlin is a public research university in Berlin, Germany, founded in 1879. With approximately 35,000 students, it is one of Germany's largest technical universities, known for engineering, computer science, and industrial process technologies." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "aalto-university", name: "Aalto University - Aaltodoc", description: "Information technology, industrial engineering, and computer science publications", baseUrl: "https://aaltodoc.aalto.fi", category: "academic_research", tags: ["research", "information-technology", "industrial-engineering", "finland"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Aalto University", description: "Aalto University is a multidisciplinary university in Espoo, Finland, formed in 2010 from a merger of three Finnish universities. With about 20,000 students, it is known for art, design, business, and technology research, particularly in information technology and industrial engineering." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "inria-hal", name: "Inria HAL", description: "French open archive for computer science and digital technology research", baseUrl: "https://inria.hal.science", category: "academic_research", tags: ["research", "digital-science", "computer-science", "france"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Inria (French National Institute for Research in Digital Science and Technology)", description: "Inria is the French national research institute for digital sciences, founded in 1967. With over 3,500 researchers across 9 centers in France, it conducts cutting-edge research in computer science, mathematics, and computational biology." }, lastVerified: "2024-01-15", priority: 2 },
  { id: "cern-document-server", name: "CERN Document Server", description: "Computing, data management, and large-scale distributed systems publications", baseUrl: "https://cds.cern.ch", category: "academic_research", tags: ["research", "computing", "distributed-systems", "switzerland"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "CERN (European Organization for Nuclear Research)", description: "CERN is the European Organization for Nuclear Research, located on the French-Swiss border near Geneva. Founded in 1954, it operates the world's largest particle physics laboratory and invented the World Wide Web. CERN pioneers large-scale computing, data storage, and distributed systems." }, lastVerified: "2024-01-15", priority: 2 },
  { id: "upc-upcommons", name: "Universitat Politècnica de Catalunya - UPCommons", description: "Industrial informatics, telecommunications, and IT systems research", baseUrl: "https://upcommons.upc.edu", category: "academic_research", tags: ["research", "telecommunications", "industrial-informatics", "spain"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Universitat Politècnica de Catalunya (UPC BarcelonaTech)", description: "UPC is a public university specializing in STEM fields in Barcelona, Spain. Founded in 1971, it is one of Spain's leading technical universities with around 30,000 students, excelling in architecture, engineering, telecommunications, and computer science." }, lastVerified: "2024-01-15", priority: 3 },
];

// ============================================================================
// INDUSTRY STANDARDS (Industrial & IT)
// ============================================================================

const THIRD_PARTY_INTEGRATIONS: ExternalSource[] = [
  { id: "itil-axelos", name: "ITIL Framework (Axelos/PeopleCert)", description: "IT Infrastructure Library - ITSM framework practices and processes", baseUrl: "https://www.axelos.com/best-practice-solutions/itil", category: "industry_standards", tags: ["itil", "itsm", "best-practices", "framework"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "PeopleCert (formerly Axelos)", description: "PeopleCert is a global leader in assessment and certification, managing ITIL, PRINCE2, and other best practice frameworks. ITIL (IT Infrastructure Library) is the world's most widely adopted framework for IT service management, used by millions of professionals." }, lastVerified: "2024-01-15", priority: 2 },
  { id: "nist-cybersecurity", name: "NIST Cybersecurity Framework", description: "Cybersecurity guidelines, controls, and risk management frameworks", baseUrl: "https://www.nist.gov/cyberframework", category: "industry_standards", tags: ["nist", "security", "compliance", "controls"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "National Institute of Standards and Technology (NIST)", description: "NIST is a US federal agency within the Department of Commerce, founded in 1901. It develops measurement standards, technology, and guidelines including the widely-adopted NIST Cybersecurity Framework and NIST 800-series security publications." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "rest-api-guidelines", name: "Microsoft REST API Guidelines", description: "Widely adopted REST API design patterns and guidelines", baseUrl: "https://github.com/microsoft/api-guidelines", category: "developer_tools", tags: ["rest", "api-design", "guidelines", "patterns"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Microsoft Corporation", description: "Microsoft is a multinational technology corporation headquartered in Redmond, Washington. Founded in 1975, it develops software, hardware, and cloud services (Azure) and is one of the world's most valuable companies, employing over 220,000 people globally." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "openapi-spec", name: "OpenAPI Specification", description: "RESTful API description and documentation standard (Swagger)", baseUrl: "https://spec.openapis.org/oas/latest.html", category: "industry_standards", tags: ["openapi", "swagger", "rest", "api-spec"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "OpenAPI Initiative (Linux Foundation)", description: "The OpenAPI Initiative is an open governance structure under the Linux Foundation focused on creating, evolving, and promoting the OpenAPI Specification (formerly Swagger). It provides a standard, programming language-agnostic interface description for REST APIs." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "json-schema", name: "JSON Schema", description: "Specification for describing and validating JSON data", baseUrl: "https://json-schema.org", category: "industry_standards", tags: ["json", "schema", "validation"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "JSON Schema Organization", description: "JSON Schema is a community-driven specification for describing the structure of JSON data. Maintained by an open-source community, it provides tools for validation, documentation, and interaction control of JSON data structures used across web APIs and configurations." }, lastVerified: "2024-01-15", priority: 4 },
  // --- INDUSTRIAL & INFORMATION TECHNOLOGY STANDARDS ---
  { id: "iso-standards", name: "ISO Standards Catalogue", description: "Standards for IT, industrial automation, quality management, and information security", baseUrl: "https://www.iso.org/standards.html", category: "industry_standards", tags: ["iso", "standards", "quality", "information-security", "industrial"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "International Organization for Standardization (ISO)", description: "ISO is an independent, non-governmental international organization with 170 member countries, founded in 1947 in Geneva, Switzerland. It has published over 24,000 international standards covering technology, food safety, agriculture, healthcare, and industrial processes." }, lastVerified: "2024-01-15", priority: 1, paths: [{ path: "/standard/27001", title: "ISO/IEC 27001 - Information Security", description: "Information security management systems" }, { path: "/standard/20000-1", title: "ISO/IEC 20000-1 - IT Service Management", description: "Service management system requirements" }] },
  { id: "iec-standards", name: "IEC International Electrotechnical Commission", description: "Standards for electrical, electronic, and industrial automation technologies", baseUrl: "https://www.iec.ch", category: "industry_standards", tags: ["iec", "electrotechnical", "industrial-automation", "plc", "scada"], enabled: true, authRequired: true, authConfig: { type: "session", loginUrl: "https://www.iec.ch/login", registrationNotes: "Free browsing. Purchase required for full standards." }, owner: { name: "International Electrotechnical Commission (IEC)", description: "The IEC is an international standards organization for all electrical, electronic, and related technologies, founded in 1906. It publishes standards for power generation, semiconductors, batteries, industrial automation (IEC 61131 PLC programming), and cybersecurity (IEC 62443)." }, lastVerified: "2024-01-15", priority: 2 },
  { id: "etsi-standards", name: "ETSI - European Telecommunications Standards Institute", description: "European standards for ICT, cloud, IoT, cybersecurity, and network technologies", baseUrl: "https://www.etsi.org", category: "industry_standards", tags: ["etsi", "telecommunications", "ict", "iot", "cloud", "europe"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "European Telecommunications Standards Institute (ETSI)", description: "ETSI is a European standards organization for ICT, founded in 1988 in Sophia Antipolis, France. It produces globally applicable standards for telecommunications, broadcasting, and electronic communications including 5G/6G, cybersecurity, IoT, and cloud computing." }, lastVerified: "2024-01-15", priority: 2 },
  { id: "cenelec-standards", name: "CEN-CENELEC Standards", description: "Industry 4.0, smart manufacturing, and digital transformation standards", baseUrl: "https://www.cencenelec.eu", category: "industry_standards", tags: ["cen", "cenelec", "european-standards", "industry-4.0"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "CEN-CENELEC (European Committee for Standardization)", description: "CEN and CENELEC are European standardization organizations recognized by the EU. They develop European Standards (EN) adopted by 34 countries, covering Industry 4.0, smart manufacturing, digital twins, AI, and sustainable technologies." }, lastVerified: "2024-01-15", priority: 2 },
  { id: "din-standards", name: "DIN - German Institute for Standardization", description: "German industrial standards for manufacturing, IT, and automation", baseUrl: "https://www.din.de/en", category: "industry_standards", tags: ["din", "german-standards", "manufacturing", "industrial"], enabled: true, authRequired: true, authConfig: { type: "session", loginUrl: "https://www.din.de/en/login", registrationNotes: "Free browsing. Standards purchase required." }, owner: { name: "Deutsches Institut für Normung (DIN)", description: "DIN is the German national organization for standardization, founded in 1917 in Berlin. It develops DIN standards widely adopted in engineering and industrial manufacturing across Europe, with over 36,000 current standards covering everything from paper sizes (DIN A4) to industrial automation." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "isa-standards", name: "ISA - International Society of Automation", description: "Automation and control systems standards (ISA-95, ISA-88) for industrial processes", baseUrl: "https://www.isa.org/standards-and-publications", category: "industry_standards", tags: ["isa", "automation", "isa-95", "mes", "industrial-control"], enabled: true, authRequired: true, authConfig: { type: "session", loginUrl: "https://www.isa.org/login", registrationNotes: "ISA membership for full access." }, owner: { name: "International Society of Automation (ISA)", description: "ISA is a non-profit professional association for automation professionals, founded in 1945. It develops globally-used standards (ISA-95 for enterprise integration, ISA-88 for batch control, ISA-99/IEC 62443 for industrial cybersecurity) adopted by manufacturing and process industries." }, lastVerified: "2024-01-15", priority: 2 },
  { id: "togaf-opengroup", name: "TOGAF - The Open Group Architecture Framework", description: "Enterprise architecture framework and IT governance methodology", baseUrl: "https://www.opengroup.org/togaf", category: "industry_standards", tags: ["togaf", "enterprise-architecture", "it-governance"], enabled: true, authRequired: true, authConfig: { type: "session", loginUrl: "https://www.opengroup.org/login", registrationNotes: "Free overview. Full standard requires membership." }, owner: { name: "The Open Group", description: "The Open Group is a global consortium of over 800 organizations that develops open standards and certifications for enterprise IT. Founded in 1996, it maintains TOGAF (enterprise architecture), ArchiMate (modeling), and the UNIX certification." }, lastVerified: "2024-01-15", priority: 2 },
  { id: "cobit-isaca", name: "COBIT - ISACA IT Governance Framework", description: "IT governance, risk management, and compliance framework", baseUrl: "https://www.isaca.org/resources/cobit", category: "industry_standards", tags: ["cobit", "it-governance", "risk-management", "compliance"], enabled: true, authRequired: true, authConfig: { type: "session", loginUrl: "https://www.isaca.org/login", registrationNotes: "ISACA membership for full access." }, owner: { name: "ISACA (Information Systems Audit and Control Association)", description: "ISACA is an international professional association for IT governance, founded in 1969. With over 170,000 members in 188 countries, it develops COBIT (IT governance framework), provides CISA/CISM/CRISC certifications, and sets global standards for information systems auditing." }, lastVerified: "2024-01-15", priority: 2 },
  { id: "opcua-foundation", name: "OPC UA - OPC Foundation", description: "Industrial interoperability standard for Industry 4.0 and IoT", baseUrl: "https://opcfoundation.org", category: "industry_standards", tags: ["opc-ua", "industrial-interoperability", "iot", "industry-4.0"], enabled: true, authRequired: true, authConfig: { type: "session", loginUrl: "https://opcfoundation.org/login", registrationNotes: "Free developer tier. Specifications accessible after registration." }, owner: { name: "OPC Foundation", description: "The OPC Foundation is an industry consortium creating interoperability standards (OPC UA) for industrial automation and IoT, founded in 1996. OPC UA is the leading machine-to-machine communication protocol for Industry 4.0, adopted by Siemens, ABB, Bosch, and 900+ member organizations." }, lastVerified: "2024-01-15", priority: 2 },
  { id: "enisa-publications", name: "ENISA - EU Agency for Cybersecurity", description: "EU cybersecurity publications, threat landscapes, and IT security best practices", baseUrl: "https://www.enisa.europa.eu/publications", category: "industry_standards", tags: ["enisa", "cybersecurity", "eu", "threat-landscape"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "European Union Agency for Cybersecurity (ENISA)", description: "ENISA is the EU agency dedicated to achieving a high common level of cybersecurity across Europe, established in 2004 in Athens, Greece. It provides expertise, publishes annual threat landscapes, and supports EU member states in implementing cybersecurity policies and NIS2 directive." }, lastVerified: "2024-01-15", priority: 2 },
  { id: "eu-digital-strategy", name: "European Commission - Digital Strategy", description: "EU digital transformation, data governance, AI regulation, and infrastructure standards", baseUrl: "https://digital-strategy.ec.europa.eu", category: "industry_standards", tags: ["eu", "digital-transformation", "data-governance", "ai-regulation"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "European Commission", description: "The European Commission is the executive branch of the European Union, responsible for proposing legislation and implementing policies. Its Digital Strategy division drives the EU's digital transformation agenda including GDPR, AI Act, Data Governance Act, and Digital Markets Act." }, lastVerified: "2024-01-15", priority: 3 },
];

// ============================================================================
// GENERAL REFERENCE
// ============================================================================

const GENERAL_REFERENCE: ExternalSource[] = [
  { id: "stack-overflow", name: "Stack Overflow", description: "Q&A community for programming questions including ServiceNow-tagged content", baseUrl: "https://stackoverflow.com", category: "general_reference", tags: ["q&a", "programming", "troubleshooting"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Stack Exchange, Inc.", description: "Stack Exchange operates Stack Overflow, the world's largest developer community with over 100 million monthly visitors. Founded in 2008, it provides a Q&A platform for programming topics with 23+ million questions and a reputation-based content moderation system." }, lastVerified: "2024-01-15", priority: 2, paths: [{ path: "/questions/tagged/servicenow", title: "ServiceNow Questions", description: "All ServiceNow-tagged questions" }] },
  { id: "refactoring-guru", name: "Refactoring.Guru", description: "Design patterns, refactoring techniques, and SOLID principles reference", baseUrl: "https://refactoring.guru", category: "general_reference", tags: ["design-patterns", "refactoring", "solid", "architecture"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Refactoring.Guru (Alexander Shvets)", description: "Refactoring.Guru is an educational resource created by Alexander Shvets that teaches software design patterns, refactoring techniques, and SOLID principles through clear illustrations and code examples in multiple programming languages." }, lastVerified: "2024-01-15", priority: 3 },
  { id: "twelve-factor-app", name: "The Twelve-Factor App", description: "Methodology for building modern, scalable SaaS applications", baseUrl: "https://12factor.net", category: "general_reference", tags: ["architecture", "methodology", "saas"], enabled: true, authRequired: false, authConfig: { type: "none" }, owner: { name: "Heroku / Adam Wiggins", description: "The Twelve-Factor App methodology was authored by developers at Heroku (now Salesforce), synthesizing best practices for building cloud-native SaaS applications. It has become a foundational reference for modern application architecture and DevOps practices." }, lastVerified: "2024-01-15", priority: 4 },
];

// ============================================================================
// EXPORTED CONNECTOR CONFIGURATION
// ============================================================================

export const DOC_SOURCES: ExternalSource[] = [
  ...SERVICENOW_OFFICIAL,
  ...SERVICENOW_COMMUNITY,
  ...DEVELOPER_TOOLS,
  ...ACADEMIC_RESEARCH,
  ...THIRD_PARTY_INTEGRATIONS,
  ...GENERAL_REFERENCE,
];

export function getEnabledSources(): ExternalSource[] {
  return DOC_SOURCES.filter((s) => s.enabled);
}

export function getSourcesByCategory(category: SourceCategory): ExternalSource[] {
  return DOC_SOURCES.filter((s) => s.enabled && s.category === category);
}

export function getSourceById(id: string): ExternalSource | undefined {
  return DOC_SOURCES.find((s) => s.id === id);
}

export const CATEGORY_LABELS: Record<SourceCategory, string> = {
  servicenow_official: "ServiceNow Official",
  servicenow_community: "ServiceNow Community",
  api_reference: "API Reference",
  developer_tools: "Developer Tools",
  academic_research: "Academic & Research",
  industry_standards: "Industry Standards",
  third_party_integrations: "Third-Party Integrations",
  general_reference: "General Reference",
};
