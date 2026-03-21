import UserLayout from "@/Layout/UserLayout";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import ProtectedRoute from "@/Components/Protected";

export default function Home() {
  const router = useRouter();
  return (
    <ProtectedRoute>
      <UserLayout>
        <div className={styles.container}>
          <div className={styles.mainContainer}>
            <div className={styles.mainContainer_left}>
              <img src="/login-hero.svg" alt="login-her o.svg" />
            </div>
            <div className={styles.mainContainer_right}>
              <p>
                Connect with the world.
                <br />
                Join the Conversation with Professionals
              </p>

              <p>
                A true Social Network for Professionals. Build your professional
                brand, network with industry leaders, and discover exciting
                career opportunities.
              </p>
              <button
                className={`btn ${styles.joinNowBtn}`}
                onClick={() => {
                  router.push("/network");
                }}
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
