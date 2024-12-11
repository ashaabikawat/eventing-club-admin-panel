import { Navigate, Route, Routes } from "react-router-dom";

import EventingClubePage from "./components/EventingClubePage";
import SuperAdminLogin from "./components/superAdmin/pages/SuperAdminLogin";
import Dashboard from "./components/superAdmin/pages/dashboard/Dashboard";
import Artist from "./components/superAdmin/components/sidebar/artist/Artist";
import Event from "./components/superAdmin/components/sidebar/event/Event";
import AdminProfile from "./components/superAdmin/components/sidebar/dashboard/AdminProfile";
import AddAddress from "./components/common/AddAddress";
import EditArtist from "./components/superAdmin/components/sidebar/artist/EditArtist";
import Categorie from "./components/superAdmin/components/sidebar/categories/Categorie";
import { EditCategorie } from "./components/superAdmin/components/sidebar/categories/EditCategorie";
import Genre from "./components/superAdmin/components/sidebar/genre/Genre";
import EditGenre from "./components/superAdmin/components/sidebar/genre/EditGenre";
import Venue from "./components/superAdmin/components/sidebar/venue/Venue";
import EditVenue from "./components/superAdmin/components/sidebar/venue/EditVenue";
import FAQ from "./components/superAdmin/components/sidebar/faq/FAQ";
import EditFaq from "./components/superAdmin/components/sidebar/faq/EditFaq";
import Organizer from "./components/superAdmin/components/sidebar/organizer/Organizer";
import EditOrganizer from "./components/superAdmin/components/sidebar/organizer/EditOrganizer";
import Promoter from "./components/superAdmin/components/sidebar/promoter/Promoter";
import EditPromoter from "./components/superAdmin/components/sidebar/promoter/EditPromoter";
import EventTour from "./components/superAdmin/components/sidebar/eventTour/EventTour";

import EditEventTour from "./components/superAdmin/components/sidebar/eventTour/EditEventTour";
import EventTag from "./components/superAdmin/components/sidebar/eventTag/EventTag";
import EditEvent from "./components/superAdmin/components/sidebar/event/EditEvent";
import TicketTable from "./components/superAdmin/components/sidebar/event/EventTable/tickets/ticketsTable/TicketTable";
import EditNormalTicket from "./components/superAdmin/components/sidebar/event/EventTable/tickets/normalTickets/EditNormalTicket";
import Customer from "./components/superAdmin/components/sidebar/customer/Customer";

// Organizer Routes
import OrganizerLogin from "./components/organizer/pages/OrganizerLogin";
import AdminProtectedRoute from "./components/superAdmin/components/core/AdminProtectedRoute";
import OrganizerDashBoard from "./components/organizer/pages/organizerDashboard/OrganizerDashBoard";
import OrganizerProtectedRoute from "./components/organizer/components/core/OrganizerProtectedRoute";
import CreateEventOrganizer from "./components/organizer/components/organizerSidebar/event/CreateEventOrganizer";
import Settings from "./components/organizer/components/organizerSidebar/settings/Settings";
import EventOrganizer from "./components/organizer/components/organizerSidebar/event/EventOrganizer";
import EditEventOrganizer from "./components/organizer/components/organizerSidebar/event/EditEventOrganizer";
import NormalTicket from "./components/organizer/components/organizerSidebar/event/ticket/NormalTicket";
import UpdateTicketByOrganizer from "./components/organizer/components/organizerSidebar/event/ticket/ticketCRUD/UpdateTicketByOrganizer";
import PromoterLogin from "./components/promoter/pages/promoterLogin";
import PromoterDashBoard from "./components/promoter/pages/promoterDashboard/PromoterDashBoard";
import EventPromoter from "./components/promoter/components/promoterSidebar/event/EventPromoter";
import EventTicketsBooking from "./components/promoter/components/promoterSidebar/event/ticketsBooking/EventTicketsBooking";
import BookTicket from "./components/promoter/components/promoterSidebar/event/ticketsBooking/BookTicket";
import PromoterForgotPassword from "./components/promoter/pages/PromoterForgotPassword";
import PromoterResetPassword from "./components/promoter/pages/PromoterResetPassword";
import OrganizerForgotPassword from "./components/organizer/pages/OrganizerForgotPassword";
import OrganizerResetPassword from "./components/organizer/pages/OrganizerResetPassword";
import EventReport from "./components/promoter/components/promoterSidebar/event/checkReport/EventReport";
import Promocodes from "./components/superAdmin/components/sidebar/promocodes/Promocodes";
import Setting from "./components/promoter/components/promoterSidebar/settings/Setting";
import EventBooking from "./components/organizer/components/organizerSidebar/event/eventBooking/EventBooking";
import EventBookingAdmin from "./components/superAdmin/components/sidebar/event/eventBooking/EventBookingAdmin";
import PromoterEventReport from "./components/promoter/components/promoterSidebar/reports/PromoterEventReport";
import OrganizerEventReport from "./components/organizer/components/organizerSidebar/reports/OrganizerEventReport";
import SuperAdminReports from "./components/superAdmin/components/sidebar/reports/SuperAdminReports";
import AdminSettings from "./components/superAdmin/components/sidebar/settings/AdminSettings";
import Bookings from "./components/superAdmin/components/sidebar/bookings/Bookings";
// import PromoterLogin from "./components/promoter/pages/PromoterLogin";
import OrganizerBooking from "./components/organizer/components/organizerSidebar/booking/OrganizerBooking";
import Banner from "./components/superAdmin/components/sidebar/banner/Banner";

import Booking from "./components/promoter/components/promoterSidebar/bookings/Booking";
import EditPromocodes from "./components/superAdmin/components/sidebar/promocodes/EditPromocodes";
import BannerEdit from "./components/superAdmin/components/sidebar/banner/BannerEdit";
import ScannerUser from "./components/superAdmin/components/sidebar/scanner user/ScannerUser";
import CustomerBookings from "./components/superAdmin/components/sidebar/customer/CustomerBookings";
import Sales from "./components/superAdmin/components/sidebar/organizer/Sales";
import ScannerEdit from "./components/superAdmin/components/sidebar/scanner user/ScannerEdit";
import LeadsTable from "./components/superAdmin/components/sidebar/leads/LeadsTable";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<EventingClubePage />} />
        <Route path="/superAdmin" element={<SuperAdminLogin />} />
        <Route
          path="/superAdmin/dashboard"
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        >
          <Route
            path="/superAdmin/dashboard/profiledata"
            element={<AdminProfile />}
          />

          {/* Side Pannel */}

          {/* Artist Routes  */}

          <Route
            path="/superAdmin/dashboard/eventtour"
            element={<EventTour />}
          />

          <Route
            path="/superAdmin/dashboard/eventtour/:_id"
            element={<EditEventTour />}
          />

          <Route path="/superAdmin/dashboard/artist" element={<Artist />} />
          <Route
            path="/superAdmin/dashboard/artist/:_id"
            element={<EditArtist />}
          />

          {/* Category Routes */}
          <Route
            path="/superAdmin/dashboard/categorie"
            element={<Categorie />}
          />
          <Route
            path="/superAdmin/dashboard/categorie/:_id"
            element={<EditCategorie />}
          />

          {/* Genre Routes */}
          <Route path="/superAdmin/dashboard/genre" element={<Genre />} />
          <Route
            path="/superAdmin/dashboard/genre/:_id"
            element={<EditGenre />}
          />

          {/* Venue Routes  */}
          <Route path="/superAdmin/dashboard/venue" element={<Venue />} />
          <Route
            path="/superAdmin/dashboard/venue/:_id"
            element={<EditVenue />}
          />

          {/* FAQ Routes  */}
          <Route path="/superAdmin/dashboard/faq" element={<FAQ />} />
          <Route path="/superAdmin/dashboard/faq/:_id" element={<EditFaq />} />

          {/* Organizer */}
          <Route
            path="/superAdmin/dashboard/organizer"
            element={<Organizer />}
          />

          <Route
            path="/superAdmin/dashboard/organizer/sales/:id"
            element={<Sales />}
          />

          <Route
            path="/superAdmin/dashboard/organizer/:_id"
            element={<EditOrganizer />}
          />

          {/* Promoter */}
          <Route path="/superAdmin/dashboard/promoter" element={<Promoter />} />
          <Route
            path="/superAdmin/dashboard/promoter/:_id"
            element={<EditPromoter />}
          />

          {/* Customer */}
          <Route path="/superAdmin/dashboard/customer" element={<Customer />} />

          <Route
            path="/superAdmin/dashboard/customer/bookings/:id"
            element={<CustomerBookings />}
          />

          {/* Event Routes */}
          <Route path="/superAdmin/dashboard/event" element={<Event />} />
          <Route
            path="/superAdmin/dashboard/event/edit/:_id"
            element={<EditEvent />}
          />
          <Route
            path="/superAdmin/dashboard/event/edit-booking/:_id"
            element={<TicketTable />}
          />

          <Route
            path="/superAdmin/dashboard/event/booking/:_id"
            element={<EventBookingAdmin />}
          />

          <Route
            path="/superAdmin/dashboard/event/edit-booking/edit-ticket/:eventId/:ticketId"
            element={<EditNormalTicket />}
          />

          {/* Event Tag Routes */}
          <Route path="/superAdmin/dashboard/eventtag" element={<EventTag />} />

          <Route
            path="/superAdmin/dashboard/report"
            element={<SuperAdminReports />}
          />

          <Route path="/superAdmin/dashboard/banner" element={<Banner />} />

          <Route
            path="/superAdmin/dashboard/scannerUser/edit/:id"
            element={<ScannerEdit />}
          />

          <Route
            path="/superAdmin/dashboard/scannerUser"
            element={<ScannerUser />}
          />

          <Route
            path="/superAdmin/dashboard/banner/:id"
            element={<BannerEdit />}
          />
          {/* Promocodes Routes */}
          <Route
            path="/superAdmin/dashboard/promocodes"
            element={<Promocodes />}
          />

          <Route
            path="/superAdmin/dashboard/promocodes/edit-promocode/:id"
            element={<EditPromocodes />}
          />

          {/* booking routes */}
          <Route path="/superAdmin/dashboard/bookings" element={<Bookings />} />

          {/* Settings routes */}
          <Route
            path="/superAdmin/dashboard/settings"
            element={<AdminSettings />}
          />

          {/* leads */}

          <Route path="/superAdmin/dashboard/leads" element={<LeadsTable />} />
        </Route>
      </Routes>

      <Routes>
        <Route path="/organizerlogin" element={<OrganizerLogin />} />
        <Route
          path="/organizer-forgotpassword"
          element={<OrganizerForgotPassword />}
        />
        <Route
          path="/organizer/resetpassword/:_token"
          element={<OrganizerResetPassword />}
        />
        <Route
          path="/organizer/dashboard"
          element={
            <OrganizerProtectedRoute>
              <OrganizerDashBoard />
            </OrganizerProtectedRoute>
          }
        >
          <Route
            path="/organizer/dashboard/event"
            element={<EventOrganizer />}
          />
          <Route
            path="/organizer/dashboard/event/:_id"
            element={<EditEventOrganizer />}
          />

          <Route
            path="/organizer/dashboard/event/ticket/:_id"
            element={<NormalTicket />}
          />

          <Route
            path="/organizer/dashboard/event/editticket/:eventId/:ticketId"
            element={<UpdateTicketByOrganizer />}
          />
          <Route
            path="/organizer/dashboard/event/booking/:_id"
            element={<EventBooking />}
          />

          {/* booking route */}

          <Route
            path="/organizer/dashboard/booking"
            element={<OrganizerBooking />}
          />
          <Route
            path="/organizer/dashboard/reports"
            element={<OrganizerEventReport />}
          />
          <Route path="/organizer/dashboard/settings" element={<Settings />} />
        </Route>
      </Routes>

      <Routes>
        <Route path="/promoterlogin" element={<PromoterLogin />} />
        <Route
          path="/promoter-forgotpassword"
          element={<PromoterForgotPassword />}
        />
        <Route
          path="/promoter/resetpassword/:_token"
          element={<PromoterResetPassword />}
        />
        <Route path="/promoter/dashboard" element={<PromoterDashBoard />}>
          <Route path="/promoter/dashboard/event" element={<EventPromoter />} />
          <Route
            path="/promoter/dashboard/event/booking/:_id"
            element={<Booking />}
          />
          <Route
            path="/promoter/dashboard/event/booking-tickets/:_id"
            element={<EventTicketsBooking />}
          />
          <Route
            path="/promoter/dashboard/event/book-ticket"
            element={<BookTicket />}
          />
          <Route
            path="/promoter/dashboard/event/report/:_id"
            element={<EventReport />}
          />
          <Route path="/promoter/dashboard/setting" element={<Setting />} />
          <Route
            path="/promoter/dashboard/report"
            element={<PromoterEventReport />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
