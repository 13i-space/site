import ContactForm from "./ContactForm";
import { CONTACT_EMAIL } from "../../../lib/story/site";

export const metadata = { title: "Contact us" };

export default function Contact() {
  return (
    <div className="sp">
      <section className="sp-hero small">
        <div className="sp-wrap">
          <div className="sos-eyebrow">Contact us</div>
          <h1>We'd love to <em>hear from you.</em></h1>
          <p className="sp-lede">Questions about Story of Self, becoming a Champion, bringing Story to your school or organization, or anything else. A real person reads every message.</p>
        </div>
      </section>
      <section className="sp-sec">
        <div className="sp-wrap sp-contact">
          <ContactForm />
          <aside className="sp-aside">
            <div>
              <b>Students and parents</b>
              <p>Most answers are on our <a href="/story#faq">questions page</a>. For help with your account, tell us the email you signed up with.</p>
            </div>
            <div>
              <b>Schools, colleges and organizations</b>
              <p>Interested in Story of Self or Champion training for your students or staff? Choose “School or organization” and we'll be in touch.</p>
            </div>
            {CONTACT_EMAIL && (
              <div>
                <b>Email</b>
                <p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
              </div>
            )}
            <div className="sp-aside-safety">
              <b>Need help right now?</b>
              <p>This form isn't watched around the clock. If you're struggling or not safe, call or text <strong>988</strong>, or text <strong>HOME</strong> to <strong>741741</strong>. In an emergency, call 911.</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
