import { useState } from 'react';
import { TELEGRAM_URL, AGENCY_EMAIL } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import SlotGame from './SlotGame';
import './Contact.css';

const ENTITY_OPTIONS = ['Частное лицо', 'Компания'];
const CONTACT_WAYS = ['Telegram', 'E-mail', 'WhatsApp'];

export default function Contact() {
  const scope = useReveal();
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [form, setForm] = useState({
    entity: 'Частное лицо',
    contactWay: 'Telegram',
    name: '',
    phone: '',
    email: '',
    tg: '',
    goals: '',
    stage: '',
    promo: '',
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${AGENCY_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Новая заявка с сайта Core Agency',
          'В каком лице': form.entity,
          'Удобный способ связи': form.contactWay,
          Имя: form.name,
          Телефон: form.phone,
          Email: form.email || '—',
          Telegram: form.tg || '—',
          'Цели и ожидания': form.goals || '—',
          'Этап проекта': form.stage || '—',
          Промокод: form.promo || '—',
        }),
      });
      if (!res.ok) throw new Error('Network');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section className="section contact" id="contact" ref={scope}>
      <div className="container contact-grid">
        <div className="contact-left">
          <div className="section-eyebrow reveal">Начните прямо сейчас</div>
          <h2 className="section-title reveal" data-delay="0.05">
            Заполните анкету <span className="gradient-text">для заявки</span>
          </h2>

          <div className="contact-bonus reveal" data-delay="0.12">
            <div className="contact-slot">
              <SlotGame />
            </div>
          </div>
        </div>

        <div className="contact-form-wrap reveal" data-delay="0.1">
          {status !== 'sent' ? (
            <form className="contact-form" onSubmit={submit}>
              <div className="field-row">
                <label className="field">
                  <span>Имя</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={upd('name')}
                    placeholder="Иван Иванов"
                    required
                  />
                </label>
                <label className="field">
                  <span>Телефон</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={upd('phone')}
                    placeholder="+7 000 000-00-00"
                    required
                  />
                </label>
              </div>

              <div className="field-row">
                <label className="field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={upd('email')}
                    placeholder="email@mail.com"
                  />
                </label>
                <label className="field">
                  <span>Телеграм</span>
                  <input
                    type="text"
                    value={form.tg}
                    onChange={upd('tg')}
                    placeholder="@username"
                  />
                </label>
              </div>

              <div className="field-row">
                <label className="field">
                  <span>Что вы хотите получить от сотрудничества с нами?</span>
                  <small className="field-hint">Ваши цели и ожидания</small>
                  <textarea
                    rows={5}
                    value={form.goals}
                    onChange={upd('goals')}
                    placeholder="Расскажите, какого результата ждёте..."
                  />
                </label>

                <label className="field">
                  <span>На каком этапе находится ваш проект или бизнес сейчас?</span>
                  <small className="field-hint">
                    Кратко опишите текущую ситуацию и существующие проблемы
                  </small>
                  <textarea
                    rows={5}
                    value={form.stage}
                    onChange={upd('stage')}
                    placeholder="Например: есть продукт, но не выстроен поток заявок..."
                  />
                </label>
              </div>

              <label className="field">
                <span>Промокод (если есть)</span>
                <input
                  type="text"
                  value={form.promo}
                  onChange={upd('promo')}
                  placeholder="Выпал в игре выше"
                />
              </label>

              <div className="field-row contact-prefs">
                <div className="field entity-field">
                  <span>Удобный способ для связи</span>
                  <div
                    className="entity-radio"
                    role="radiogroup"
                    aria-label="Удобный способ связи"
                  >
                    {CONTACT_WAYS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        role="radio"
                        aria-checked={form.contactWay === opt}
                        className={`entity-pick ${form.contactWay === opt ? 'is-active' : ''}`}
                        onClick={() => setForm((f) => ({ ...f, contactWay: opt }))}
                      >
                        <span className="entity-box" aria-hidden="true" />
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field entity-field">
                  <span>В каком лице вы к нам обращаетесь?</span>
                  <div
                    className="entity-radio"
                    role="radiogroup"
                    aria-label="В каком лице вы к нам обращаетесь"
                  >
                    {ENTITY_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        role="radio"
                        aria-checked={form.entity === opt}
                        className={`entity-pick ${form.entity === opt ? 'is-active' : ''}`}
                        onClick={() => setForm((f) => ({ ...f, entity: opt }))}
                      >
                        <span className="entity-box" aria-hidden="true" />
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary contact-submit magnetic"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Отправляем...' : 'Отправить заявку'}
              </button>
              {status === 'error' && (
                <p className="contact-error">
                  Не удалось отправить. Напишите нам в Telegram — ответим сразу.
                </p>
              )}
              <p className="contact-policy">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности и обработкой данных.
              </p>
            </form>
          ) : (
            <div className="contact-success">
              <div className="contact-success-icon">✓</div>
              <h3>Сообщение отправлено!</h3>
              <p>Мы свяжемся с вами в течение 2 часов.</p>
              <a className="btn btn-ghost magnetic" href={TELEGRAM_URL} target="_blank" rel="noreferrer">
                Написать в Telegram
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
