**Our Core Goal:** To create a stable, end-to-end experience where a Customer can find, view, and book a Technician, and the Technician can see and manage that booking. This plan fixes all known UI bugs and implements the core technician profile feature.

---

#### **Step 1: Build the Core Data Connection**

* **Problem:** This is the most important issue. There is no reliable data link between what a technician does and what a customer sees. A new technician signs up but doesn't appear for customers. A customer books a job, but the technician never sees it. The system is disconnected.
* **The Fix:** We will establish a "single source of truth" in the database that everything else will use.
    * When a new **Technician** signs up, a row **must** be created in your `profiles` table in Supabase with their details and `role: 'technician'`.
    * When a **Customer** books that technician, a new row **must** be created in your `jobs` table. This row **must** contain the correct `customer_id` and `technician_id`.
    * This data connection is the foundation. Every other step depends on it being right.

---

#### **Step 2: Implement the Technician Profile & Discovery Feature**

* **Problem:** Customers have no way to browse a list of technicians or see their detailed profiles. This is a missing core feature. The existing filters on the homepage are also broken.
* **The Fix:** We will transform the homepage into a functional discovery tool and create a new page for technician profiles.
    * **On the Homepage (`/`):**
        1.  The page will fetch all users with `role: 'technician'` from the `profiles` table and display them.
        2.  For each technician, you will render a new UI component: a **`Technician Profile Card`**. This card must be clean and professional, showing the technician's photo, name, star rating (e.g., ⭐️ 4.8), and their main specialties (e.g., "Laptop Repair").
        3.  Make the "Popular Services" buttons work. When a customer clicks a button, the list of technician cards on the page must filter instantly to show only technicians with that specialty.
        4.  Each `Technician Profile Card` must be clickable, leading to their full profile page.
    * **The New Technician Profile Page (`/technician/[id]`):**
        1.  You will create this new page. It does not currently exist.
        2.  When a customer clicks a profile card, they navigate here.
        3.  This page will display everything about one technician: a large photo, their detailed bio and experience, a full list of their skills, and a dedicated section listing all their past customer reviews and comments.
        4.  This page must have a clear **"Book This Technician"** button, which takes the user to the booking form that you have already built.

---

#### **Step 3: Fix the Technician's Journey (Signup & Dashboard)**

* **Problem:** The technician experience is completely broken. They can't sign up correctly, and their dashboard is unusable.
* **The Fix:** We will repair the flow from start to finish.
    * **Signup:** After a technician successfully fills out the signup form, they **must** be redirected straight to their dashboard at `/technician/dashboard`. The current redirect to a 404 error page must be removed.
    * **Dashboard:** The dashboard must be stable and show real data.
        1.  **Kill the infinite loop.** When fetching jobs, if the database finds nothing, the page must simply display a message like **"No new jobs."** and stop loading.
        2.  **Remove all fake data.** The stat cards for earnings, ratings, and jobs must show real numbers calculated from the `jobs` and `reviews` tables in Supabase. If there is no data, it must show **0**.

---

#### **Step 4: Fix All Customer UI & Navigation Bugs**

* **Problem:** The user interface for logged-in customers is confusing and broken.
* **The Fix:** We will make the UI smart and responsive to the user's status.
    * **Navigation Bar:** The main navigation bar **must** change based on whether a user is logged in.
        * If the user is logged in, hide the "Login" and "Get Started" buttons. Show them links like "My Bookings" and a "Profile/Logout" menu instead.
        * The technician's dashboard should not have a duplicate navigation bar. It should use a single, shared layout.
    * **Redirects:** After a customer logs in, they **must** be automatically sent to the homepage (`/`) where they can see the list of technicians.