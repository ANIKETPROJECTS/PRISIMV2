import { db } from "./db";
import { companies, users, rooms, customers, customerContacts, projects, editors, bookings, bookingLogs, chalans, chalanItems, editorLeaves } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Always re-seed to get fresh data with new bookings
  // Delete all dependent data first
  await db.delete(bookingLogs);
  await db.delete(bookings);
  await db.delete(editorLeaves);
  await db.delete(chalanItems);
  await db.delete(chalans);
  await db.delete(customerContacts);
  await db.delete(projects);
  await db.delete(customers);
  await db.delete(rooms);
  await db.delete(editors);
  await db.delete(users);
  await db.delete(companies);

  {
    // Create the two companies
    const [prismCompany] = await db.insert(companies).values({
      name: "PRISM",
      address: "Mumbai, India",
      gstNumber: "27AABCP1234A1Z5",
    }).returning();

    const [airavataCompany] = await db.insert(companies).values({
      name: "Airavata Studio",
      address: "Mumbai, India",
      gstNumber: "27AABCA5678B2Z9",
    }).returning();

    console.log("Created companies:", prismCompany.name, airavataCompany.name);

    // Create default admin users for each company
    await db.insert(users).values({
      username: "admin",
      password: "admin123",
      securityPin: "1234",
      role: "admin",
      companyId: prismCompany.id,
      isActive: true,
    });

    await db.insert(users).values({
      username: "airavata_admin",
      password: "admin123",
      securityPin: "1234",
      role: "admin",
      companyId: airavataCompany.id,
      isActive: true,
    });

    console.log("Created default admin users for both companies");

    // Create Rooms
    const roomsData = await db.insert(rooms).values([
      { name: "Studio A", roomType: "editing", capacity: 2, ignoreConflict: false, isActive: true },
      { name: "Studio B", roomType: "editing", capacity: 3, ignoreConflict: false, isActive: true },
      { name: "Sound Room", roomType: "sound", capacity: 1, ignoreConflict: false, isActive: true },
      { name: "VFX Lab", roomType: "vfx", capacity: 4, ignoreConflict: false, isActive: true },
      { name: "Music Room", roomType: "music", capacity: 2, ignoreConflict: false, isActive: true },
      { name: "Dubbing Theater", roomType: "dubbing", capacity: 6, ignoreConflict: false, isActive: true },
      { name: "Mixing Suite", roomType: "mixing", capacity: 2, ignoreConflict: false, isActive: true },
    ]).returning();

    console.log("Created rooms:", roomsData.length);

    // Create Customers
    const customersData = await db.insert(customers).values([
      { name: "Bollywood Productions", companyName: "Bollywood Prod Ltd", address: "Bandra, Mumbai", phone: "9876543210", email: "contact@bollywood.com", gstNumber: "27AABCP5555A1Z0", isActive: true },
      { name: "Digital Stories", companyName: "Digital Stories Inc", address: "Fort, Mumbai", phone: "9876543211", email: "hello@digitalstories.com", gstNumber: "27AABCP6666A1Z1", isActive: true },
      { name: "Epic Entertainment", companyName: "Epic Ent Pvt", address: "Andheri, Mumbai", phone: "9876543212", email: "info@epicent.com", gstNumber: "27AABCP7777A1Z2", isActive: true },
      { name: "Creative Minds", companyName: "Creative Minds Pvt Ltd", address: "Powai, Mumbai", phone: "9876543213", email: "team@creativeminds.com", gstNumber: "27AABCP8888A1Z3", isActive: true },
    ]).returning();

    console.log("Created customers:", customersData.length);

    // Create Customer Contacts
    const contactsData = await db.insert(customerContacts).values([
      { customerId: customersData[0].id, name: "Rajesh Kumar", phone: "9876543214", email: "rajesh@bollywood.com", designation: "Producer", isPrimary: true },
      { customerId: customersData[0].id, name: "Priya Singh", phone: "9876543215", email: "priya@bollywood.com", designation: "Director", isPrimary: false },
      { customerId: customersData[1].id, name: "Amit Verma", phone: "9876543216", email: "amit@digitalstories.com", designation: "Project Manager", isPrimary: true },
      { customerId: customersData[2].id, name: "Neha Sharma", phone: "9876543217", email: "neha@epicent.com", designation: "Content Lead", isPrimary: true },
      { customerId: customersData[3].id, name: "Vikram Patel", phone: "9876543218", email: "vikram@creativeminds.com", designation: "Creative Director", isPrimary: true },
    ]).returning();

    console.log("Created customer contacts:", contactsData.length);

    // Create Projects
    const projectsData = await db.insert(projects).values([
      { name: "Action Movie - 2025", customerId: customersData[0].id, projectType: "movie", description: "High-action blockbuster film", isActive: true },
      { name: "Web Series - Season 1", customerId: customersData[1].id, projectType: "web_series", description: "Crime thriller web series", isActive: true },
      { name: "Ad Campaign - Spring", customerId: customersData[2].id, projectType: "ad", description: "Commercial advertisement", isActive: true },
      { name: "Movie Teaser Pack", customerId: customersData[0].id, projectType: "teaser", description: "Teaser videos for upcoming movie", isActive: true },
      { name: "Serial - Daily Episodes", customerId: customersData[1].id, projectType: "serial", description: "Daily TV serial episodes", isActive: true },
    ]).returning();

    console.log("Created projects:", projectsData.length);

    // Create Editors
    const editorsData = await db.insert(editors).values([
      { name: "Rahul Gupta", editorType: "video", phone: "9876543220", email: "rahul@editors.com", joinDate: "2023-01-15", isActive: true, ignoreConflict: false },
      { name: "Priya Desai", editorType: "audio", phone: "9876543221", email: "priya@editors.com", joinDate: "2023-02-20", isActive: true, ignoreConflict: false },
      { name: "Arjun Singh", editorType: "vfx", phone: "9876543222", email: "arjun@editors.com", joinDate: "2023-03-10", isActive: true, ignoreConflict: false },
      { name: "Divya Nair", editorType: "colorist", phone: "9876543223", email: "divya@editors.com", joinDate: "2023-04-05", isActive: true, ignoreConflict: false },
      { name: "Sanjay Reddy", editorType: "di", phone: "9876543224", email: "sanjay@editors.com", joinDate: "2023-05-12", isActive: true, ignoreConflict: false },
    ]).returning();

    console.log("Created editors:", editorsData.length);

    // Create Bookings for different dates with various configurations
    const today = new Date();
    const bookingsData = await db.insert(bookings).values([
      // System Room + System Editor (Dec 4 - multiple bookings)
      { roomId: roomsData[0].id, customerId: customersData[0].id, projectId: projectsData[0].id, contactId: contactsData[0].id, editorId: editorsData[0].id, bookingDate: "2025-12-04", fromTime: "09:00", toTime: "13:00", status: "confirmed", totalHours: 4, notes: "Main editing session" },
      { roomId: roomsData[1].id, customerId: customersData[1].id, projectId: projectsData[1].id, contactId: contactsData[2].id, editorId: editorsData[1].id, bookingDate: "2025-12-04", fromTime: "14:00", toTime: "18:00", status: "confirmed", totalHours: 4, notes: "Audio mixing" },
      // Additional bookings on Dec 4 to show multiple bookings in a day
      { roomId: roomsData[2].id, customerId: customersData[2].id, projectId: projectsData[2].id, contactId: contactsData[3].id, editorId: editorsData[2].id, bookingDate: "2025-12-04", fromTime: "08:00", toTime: "10:00", status: "planning", totalHours: 2, notes: "Quick VFX consultation" },
      { roomId: roomsData[3].id, customerId: customersData[3].id, projectId: projectsData[1].id, contactId: contactsData[4].id, editorId: editorsData[3].id, bookingDate: "2025-12-04", fromTime: "10:30", toTime: "12:30", status: "tentative", totalHours: 2, notes: "Color correction work" },
      { roomId: roomsData[4].id, customerId: customersData[0].id, projectId: projectsData[3].id, contactId: contactsData[0].id, editorId: editorsData[4].id, bookingDate: "2025-12-04", fromTime: "15:00", toTime: "17:00", status: "planning", totalHours: 2, notes: "Music selection session" },
      { roomId: roomsData[2].id, customerId: customersData[0].id, projectId: projectsData[0].id, contactId: contactsData[1].id, editorId: editorsData[2].id, bookingDate: "2025-12-05", fromTime: "10:00", toTime: "15:00", status: "tentative", totalHours: 5, notes: "VFX work" },
      { roomId: roomsData[3].id, customerId: customersData[2].id, projectId: projectsData[2].id, contactId: contactsData[3].id, editorId: editorsData[3].id, bookingDate: "2025-12-05", fromTime: "16:00", toTime: "20:00", status: "planning", totalHours: 4, notes: "Color grading" },
      { roomId: roomsData[4].id, customerId: customersData[1].id, projectId: projectsData[4].id, contactId: contactsData[2].id, editorId: editorsData[4].id, bookingDate: "2025-12-06", fromTime: "09:00", toTime: "12:00", status: "confirmed", totalHours: 3, notes: "Music composition" },
      { roomId: roomsData[5].id, customerId: customersData[3].id, projectId: projectsData[2].id, contactId: contactsData[4].id, editorId: editorsData[1].id, bookingDate: "2025-12-06", fromTime: "14:00", toTime: "18:00", status: "confirmed", totalHours: 4, notes: "Dubbing session" },
      { roomId: roomsData[0].id, customerId: customersData[0].id, projectId: projectsData[3].id, contactId: contactsData[0].id, editorId: editorsData[0].id, bookingDate: "2025-12-07", fromTime: "10:00", toTime: "16:00", status: "tentative", totalHours: 6, notes: "Teaser editing" },
      { roomId: roomsData[1].id, customerId: customersData[1].id, projectId: projectsData[1].id, contactId: contactsData[2].id, editorId: editorsData[2].id, bookingDate: "2025-12-08", fromTime: "09:00", toTime: "17:00", status: "planning", totalHours: 8, notes: "Full day editing session" },
      // Client Room + System Editor
      { customerId: customersData[2].id, projectId: projectsData[2].id, contactId: contactsData[3].id, editorId: editorsData[3].id, clientRoomName: "Paramount Studios", clientRoomType: "editing", bookingDate: "2025-12-09", fromTime: "10:00", toTime: "14:00", status: "confirmed", totalHours: 4, notes: "Client provided editing suite" },
      // System Room + Client Editor
      { roomId: roomsData[6].id, customerId: customersData[3].id, projectId: projectsData[0].id, contactId: contactsData[4].id, clientEditorName: "Kavya Sharma", clientEditorType: "audio", clientEditorPhone: "9988776655", clientEditorEmail: "kavya.sharma@freelance.com", bookingDate: "2025-12-10", fromTime: "11:00", toTime: "15:00", status: "tentative", totalHours: 4, notes: "Client's audio specialist" },
      // Client Room + Client Editor
      { customerId: customersData[0].id, projectId: projectsData[4].id, contactId: contactsData[0].id, clientRoomName: "Silverscreen Productions", clientRoomType: "vfx", clientEditorName: "Aditya Patel", clientEditorType: "vfx", clientEditorPhone: "9911223344", clientEditorEmail: "aditya.vfx@company.com", bookingDate: "2025-12-11", fromTime: "09:00", toTime: "13:00", status: "planning", totalHours: 4, notes: "Client's VFX studio and artist" },
      // Mixed: System Room + Client Editor (alternative supplier)
      { roomId: roomsData[4].id, customerId: customersData[1].id, projectId: projectsData[1].id, contactId: contactsData[2].id, clientEditorName: "Zara Khan", clientEditorType: "video", clientEditorPhone: "9944556677", clientEditorEmail: "zara.khan@freelance.com", bookingDate: "2025-12-12", fromTime: "14:00", toTime: "18:00", status: "confirmed", totalHours: 4, notes: "Freelance video editor for special work" },
      // Client Room Only (no editor assigned yet)
      { customerId: customersData[2].id, projectId: projectsData[3].id, contactId: contactsData[3].id, clientRoomName: "Dream Studios Mumbai", clientRoomType: "sound", bookingDate: "2025-12-13", fromTime: "10:00", toTime: "12:00", status: "planning", totalHours: 2, notes: "Client facility, editor TBD" },
    ]).returning();

    console.log("Created bookings:", bookingsData.length);

    // Create Editor Leaves
    await db.insert(editorLeaves).values([
      { editorId: editorsData[0].id, fromDate: "2025-12-25", toDate: "2025-12-31", reason: "Holiday break" },
      { editorId: editorsData[1].id, fromDate: "2025-12-15", toDate: "2025-12-17", reason: "Personal leave" },
      { editorId: editorsData[2].id, fromDate: "2025-12-10", toDate: "2025-12-12", reason: "Medical leave" },
    ]).returning();

    console.log("Created editor leaves");

    // Create Chalans
    const chalansData = await db.insert(chalans).values([
      { chalanNumber: "CH-2025-001", customerId: customersData[0].id, projectId: projectsData[0].id, chalanDate: "2025-12-01", totalAmount: 150000, isCancelled: false, notes: "Editing and VFX services" },
      { chalanNumber: "CH-2025-002", customerId: customersData[1].id, projectId: projectsData[1].id, chalanDate: "2025-12-02", totalAmount: 200000, isCancelled: false, notes: "Web series production" },
      { chalanNumber: "CH-2025-003", customerId: customersData[2].id, projectId: projectsData[2].id, chalanDate: "2025-12-03", totalAmount: 75000, isCancelled: false, notes: "Ad campaign services" },
      { chalanNumber: "CH-2025-004", customerId: customersData[0].id, projectId: projectsData[3].id, chalanDate: "2025-12-04", totalAmount: 50000, isCancelled: false, notes: "Teaser production" },
      { chalanNumber: "CH-2025-005", customerId: customersData[1].id, projectId: projectsData[4].id, chalanDate: "2025-12-04", totalAmount: 120000, isCancelled: false, notes: "Serial episode production" },
    ]).returning();

    console.log("Created chalans:", chalansData.length);

    // Create Chalan Items
    await db.insert(chalanItems).values([
      { chalanId: chalansData[0].id, description: "Editing - Feature film (20 hrs)", quantity: 20, rate: 5000, amount: 100000 },
      { chalanId: chalansData[0].id, description: "VFX Services (10 hrs)", quantity: 10, rate: 5000, amount: 50000 },
      { chalanId: chalansData[1].id, description: "Web Series Editing (25 hrs)", quantity: 25, rate: 6000, amount: 150000 },
      { chalanId: chalansData[1].id, description: "Audio Mixing (5 hrs)", quantity: 5, rate: 10000, amount: 50000 },
      { chalanId: chalansData[2].id, description: "Advertisement Production", quantity: 1, rate: 75000, amount: 75000 },
      { chalanId: chalansData[3].id, description: "Teaser Editing (8 hrs)", quantity: 8, rate: 5000, amount: 40000 },
      { chalanId: chalansData[3].id, description: "Color Grading (2 hrs)", quantity: 2, rate: 5000, amount: 10000 },
      { chalanId: chalansData[4].id, description: "Serial Episode Editing (15 hrs)", quantity: 15, rate: 6000, amount: 90000 },
      { chalanId: chalansData[4].id, description: "Sound Design (3 hrs)", quantity: 3, rate: 10000, amount: 30000 },
    ]).returning();

    console.log("Created chalan items");
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);

seed().catch(console.error);
