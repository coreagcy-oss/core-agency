import { useState } from 'react';
import { TELEGRAM_URL, AGENCY_EMAIL } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import SlotGame from './SlotGame';
import './Contact.css';

const ENTITY_OPTIONS = ['Частное лицо', 'Компания'];
const CONTACT_WAYS = ['Telegram', 'E-mail', 'WhatsApp'];

// Имя и фамилия — только кириллица, минимум два слова (имя + фамилия).
const NAME_RE = /^[А-Яа-яЁё]+(?:[-\s][А-Яа-яЁё]+)+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Telegram-username: начинается с @, далее 4–31 символ (буквы/цифры/_).
const TG_RE = /^@[A-Za-z0-9_]{4,31}$/;
// Только цифры из строки телефона.
const phoneDigits = (v) => v.replace(/\D/g, '');
// Номер РФ: + в начале, далее ровно 11 цифр, первая — 7 (+7 и 10 цифр).
const isPhoneValid = (v) => v.trim().startsWith('+') && /^7\d{10}$/.test(phoneDigits(v));

function validate(f) {
  const e = {};
  if (!NAME_RE.test(f.name.trim())) e.name = 'Укажите имя и фамилию на русском';
  if (!isPhoneValid(f.phone)) e.phone = 'Формат: +7 и 10 цифр';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Введите корректный email';
  if (!TG_RE.test(f.tg.trim())) e.tg = 'Username через @, например @core';
  if (!f.goals.trim()) e.goals = 'Заполните это поле';
  if (!f.stage.trim()) e.stage = 'Заполните это поле';
  if (!f.contactWay) e.contactWay = 'Выберите способ связи';
  if (!f.entity) e.entity = 'Выберите вариант';
  return e;
}

export default function Contact() {
  const scope = useReveal();
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    entity: '',
    contactWay: '',
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
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length || status === 'sending') return;
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
          Email: form.email,
          Telegram: form.tg,
          'Цели и ожидания': form.goals,
          'Этап проекта': form.stage,
          Промокод: form.promo || '—',
        }),
      });
      if (!res.ok) throw new Error('Network');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const clearErr = (k) => setErrors((er) => (er[k] ? { ...er, [k]: undefined } : er));

  const upd = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    clearErr(k);
  };

  // Телефон: гарантируем + в начале.
  const updPhone = (e) => {
    let v = e.target.value;
    if (v && !v.startsWith('+')) v = '+' + v.replace(/\+/g, '');
    setForm((f) => ({ ...f, phone: v }));
    clearErr('phone');
  };

  // Telegram: гарантируем @ в начале.
  const updTg = (e) => {
    let v = e.target.value;
    if (v && !v.startsWith('@')) v = '@' + v.replace(/@/g, '');
    setForm((f) => ({ ...f, tg: v }));
    clearErr('tg');
  };

  const pick = (k, opt) => {
    setForm((f) => ({ ...f, [k]: opt }));
    clearErr(k);
  };

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
            <form className="contact-form" onSubmit={submit} noValidate>
              <div className="field-row">
                <label className="field">
                  <span>Имя и фамилия</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={upd('name')}
                    placeholder="Иван Иванов"
                    className={errors.name ? 'has-error' : ''}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <small className="field-error">{errors.name}</small>}
                </label>
                <label className="field">
                  <span>Телефон</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={updPhone}
                    placeholder="+7 000 000-00-00"
                    className={errors.phone ? 'has-error' : ''}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && <small className="field-error">{errors.phone}</small>}
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
                    className={errors.email ? 'has-error' : ''}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <small className="field-error">{errors.email}</small>}
                </label>
                <label className="field">
                  <span>Телеграм</span>
                  <input
                    type="text"
                    value={form.tg}
                    onChange={updTg}
                    placeholder="@username"
                    className={errors.tg ? 'has-error' : ''}
                    aria-invalid={!!errors.tg}
                  />
                  {errors.tg && <small className="field-error">{errors.tg}</small>}
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
                    className={errors.goals ? 'has-error' : ''}
                    aria-invalid={!!errors.goals}
                  />
                  {errors.goals && <small className="field-error">{errors.goals}</small>}
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
                    className={errors.stage ? 'has-error' : ''}
                    aria-invalid={!!errors.stage}
                  />
                  {errors.stage && <small className="field-error">{errors.stage}</small>}
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
                        onClick={() => pick('contactWay', opt)}
                      >
                        <span className="entity-box" aria-hidden="true" />
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errors.contactWay && <small className="field-error">{errors.contactWay}</small>}
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
                        onClick={() => pick('entity', opt)}
                      >
                        <span className="entity-box" aria-hidden="true" />
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errors.entity && <small className="field-error">{errors.entity}</small>}
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
