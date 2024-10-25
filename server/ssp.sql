--
-- PostgreSQL database dump
--

-- Dumped from database version 12.14 (Ubuntu 12.14-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.14 (Ubuntu 12.14-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    booking_id integer NOT NULL,
    devote_id integer,
    booking_date date,
    tot_book_rooms integer,
    re_book_cost numeric(18,2),
    no_of_members integer,
    no_of_male integer,
    no_of_female integer,
    no_of_kids integer,
    no_of_rooms_request integer,
    status character(1),
    cr_on timestamp without time zone,
    cr_by character varying(50) DEFAULT NULL::character varying,
    mo_on timestamp without time zone,
    mo_by character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.booking OWNER TO postgres;

--
-- Name: devotee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devotee (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    devote_id integer NOT NULL,
    group_id integer,
    name character varying(100),
    address character varying(100),
    phone character varying(15),
    adhar character varying(12),
    age integer,
    gender character(1),
    no_of_members integer,
    no_of_male integer,
    no_of_female integer,
    no_of_kids integer,
    no_of_rooms_request integer,
    is_group "char",
    cr_on timestamp without time zone,
    cr_by character varying(50) DEFAULT NULL::character varying,
    mo_on timestamp without time zone,
    mo_by character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.devotee OWNER TO postgres;

--
-- Name: entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entity (
    entity_id integer NOT NULL,
    name character varying(100),
    address character varying(100),
    reg_num character varying(100),
    estab_date date,
    bank_ac_num character varying(50),
    bank_ifsc character varying(20),
    bank_name character varying(50),
    bank_location character varying(50),
    cr_on timestamp without time zone,
    cr_by character varying(50) DEFAULT NULL::character varying,
    mo_on timestamp without time zone,
    mo_by character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.entity OWNER TO postgres;

--
-- Name: event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    name character varying(100),
    location character varying(50),
    start_date date,
    end_date date,
    free_book_days integer,
    cr_on timestamp without time zone,
    cr_by character varying(50) DEFAULT NULL::character varying,
    mo_on timestamp without time zone,
    mo_by character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.event OWNER TO postgres;

--
-- Name: event_organizers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_organizers (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    sl integer NOT NULL,
    poc_name character varying(50),
    location character varying(100),
    poc_email character varying(30),
    poc_phone character varying(15),
    role character varying(100),
    cr_on timestamp without time zone,
    cr_by character varying(50) DEFAULT NULL::character varying,
    mo_on timestamp without time zone,
    mo_by character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.event_organizers OWNER TO postgres;

--
-- Name: event_sevamast; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_sevamast (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    seva_code integer NOT NULL,
    seva_desc character varying(100) NOT NULL,
    seva_amount numeric(18,2),
    group_id integer NOT NULL,
    is_active character(1),
    seva_at character(1),
    cr_on date NOT NULL,
    cr_by character varying(50) NOT NULL,
    mo_on date,
    mo_by character varying(50)
);


ALTER TABLE public.event_sevamast OWNER TO postgres;

--
-- Name: group_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_items (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    group_id integer NOT NULL,
    sl integer NOT NULL,
    description character varying(100),
    qty integer,
    momento_id integer,
    is_active character(1),
    cr_on date NOT NULL,
    cr_by character varying(50) NOT NULL,
    mo_on date,
    mo_by character varying(50)
);


ALTER TABLE public.group_items OWNER TO postgres;

--
-- Name: group_member_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_member_info (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    devote_id integer NOT NULL,
    sl integer NOT NULL,
    name character varying(100),
    age integer,
    gender character(1),
    address character varying(100),
    phone character varying(12),
    adhar character varying(12),
    group_head boolean,
    cr_on timestamp without time zone,
    cr_by character varying(50) DEFAULT NULL::character varying,
    mo_on timestamp without time zone,
    mo_by character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.group_member_info OWNER TO postgres;

--
-- Name: group_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_type (
    entity_id integer NOT NULL,
    group_id integer NOT NULL,
    description character varying(100),
    is_active character(1),
    cr_on date,
    cr_by character varying(50),
    mo_on date,
    mo_by character varying(50)
);


ALTER TABLE public.group_type OWNER TO postgres;

--
-- Name: infra_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.infra_type (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    infra_id integer NOT NULL,
    infra_type integer NOT NULL,
    name character varying(50),
    max_capacity integer,
    cost numeric(18,2),
    ac_nac "char",
    cr_on timestamp without time zone,
    cr_by character varying(50) DEFAULT NULL::character varying,
    mo_on timestamp without time zone,
    mo_by character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.infra_type OWNER TO postgres;

--
-- Name: infrastructure; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.infrastructure (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    infra_id integer NOT NULL,
    name character varying(100),
    location character varying(100),
    poc_name character varying(50),
    poc_email character varying(30),
    poc_phone character varying(15),
    cr_on timestamp without time zone,
    cr_by character varying(50) DEFAULT NULL::character varying,
    mo_on timestamp without time zone,
    mo_by character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.infrastructure OWNER TO postgres;

--
-- Name: infratype_book; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.infratype_book (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    infra_id integer NOT NULL,
    infra_type integer NOT NULL,
    sl integer NOT NULL,
    book_start_date date,
    book_end_date date,
    tot_days integer,
    num_of_rooms integer,
    rent numeric(18,2),
    tot_rent numeric(18,2),
    cr_on date NOT NULL,
    cr_by character varying(50) NOT NULL,
    mo_on date,
    mo_by character varying(50)
);


ALTER TABLE public.infratype_book OWNER TO postgres;

--
-- Name: momento_distribution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.momento_distribution (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    disb_id integer NOT NULL,
    momento_id integer NOT NULL,
    devote_id integer,
    name character varying(100),
    disb_date date,
    momento_qty integer,
    status character(1),
    cr_on date,
    cr_by character varying(50),
    mo_on date,
    mo_by character varying(50),
    seva_code integer
);


ALTER TABLE public.momento_distribution OWNER TO postgres;

--
-- Name: momento_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.momento_type (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    momento_id integer NOT NULL,
    description character varying(100),
    is_active character(1),
    cr_on date NOT NULL,
    cr_by character varying(50) NOT NULL,
    mo_on date,
    mo_by character varying(50)
);


ALTER TABLE public.momento_type OWNER TO postgres;

--
-- Name: office_bearers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.office_bearers (
    entity_id integer NOT NULL,
    sl integer NOT NULL,
    name character varying(100),
    address character varying(100),
    email_id character varying(100),
    contact_no character varying(100),
    role character varying(100),
    adhar character varying(12),
    age integer,
    gender character(1),
    elect_date date,
    term_end_date date,
    is_active character(1),
    cr_on date NOT NULL,
    cr_by character varying(50) NOT NULL,
    mo_on date,
    mo_by character varying(50)
);


ALTER TABLE public.office_bearers OWNER TO postgres;

--
-- Name: role_access; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_access (
    entity_id integer NOT NULL,
    role_id integer NOT NULL,
    role_name character varying(50) DEFAULT NULL::character varying,
    login_req character(1) DEFAULT NULL::bpchar,
    is_staff boolean,
    is_admin boolean,
    is_superadmin boolean,
    is_active boolean,
    cr_on timestamp without time zone,
    cr_by character varying(50) DEFAULT NULL::character varying,
    mo_on timestamp without time zone,
    mo_by character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.role_access OWNER TO postgres;

--
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    infra_id integer NOT NULL,
    room_number character varying(50) NOT NULL,
    infra_type integer,
    atach_br boolean,
    floor integer,
    max_capacity integer,
    block character varying,
    sl integer,
    cr_on timestamp without time zone,
    cr_by character varying(50) DEFAULT NULL::character varying,
    mo_on timestamp without time zone,
    mo_by character varying(50) DEFAULT NULL::character varying,
    new_room_number character varying(50)
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- Name: rooms_booked; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms_booked (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    infra_id integer NOT NULL,
    booking_id integer NOT NULL,
    room_number character varying(50) NOT NULL,
    booking_from timestamp without time zone,
    booking_to timestamp without time zone,
    extra_bed integer,
    status character(1),
    cr_on timestamp without time zone,
    cr_by character varying(50) DEFAULT NULL::character varying,
    mo_on timestamp without time zone,
    mo_by character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.rooms_booked OWNER TO postgres;

--
-- Name: rooms_old; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms_old (
    entity_id integer,
    event_id integer,
    infra_id integer,
    room_number character varying(50),
    infra_type integer,
    atach_br boolean,
    floor integer,
    max_capacity integer,
    block character varying,
    sl integer,
    cr_on timestamp without time zone,
    cr_by character varying(50),
    mo_on timestamp without time zone,
    mo_by character varying(50),
    new_room_number character varying(50)
);


ALTER TABLE public.rooms_old OWNER TO postgres;

--
-- Name: seva_booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seva_booking (
    entity_id integer NOT NULL,
    event_id integer NOT NULL,
    booking_id integer NOT NULL,
    sl integer NOT NULL,
    devote_id integer,
    rcpt_num integer,
    rcpt_date date,
    rcpt_amt numeric(18,2),
    seva_date date,
    seva_code integer,
    seva_amount numeric(18,2),
    seva_qty integer,
    tot_seva_amount numeric(18,2),
    sanman_qty integer,
    status character(1),
    cr_on date,
    cr_by character varying(50),
    mo_on date,
    mo_by character varying(50),
    remarks character varying(100),
    mode_of_payment "char",
    reference_number character varying(25),
    clearing_amount numeric(18,2),
    reference_date date,
    bank_name character varying(30),
    bank_branch character varying(30)
);


ALTER TABLE public.seva_booking OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    entity_id integer NOT NULL,
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    user_name character varying(50) DEFAULT NULL::character varying,
    user_password character varying(200) DEFAULT NULL::character varying,
    full_name character varying(100) DEFAULT NULL::character varying,
    email_id character varying(100) DEFAULT NULL::character varying,
    contact_no character varying(100) DEFAULT NULL::character varying,
    user_active character(1) DEFAULT NULL::bpchar,
    cr_on timestamp without time zone,
    cr_by character varying(50) DEFAULT NULL::character varying,
    mo_on timestamp without time zone,
    mo_by character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: devotee devotee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devotee
    ADD CONSTRAINT devotee_pkey PRIMARY KEY (entity_id, event_id, devote_id);


--
-- Name: entity entity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entity
    ADD CONSTRAINT entity_pkey PRIMARY KEY (entity_id);


--
-- Name: event_organizers event_organizers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_organizers
    ADD CONSTRAINT event_organizers_pkey PRIMARY KEY (entity_id, event_id, sl);


--
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (entity_id, event_id);


--
-- Name: event_sevamast event_sevamast_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_sevamast
    ADD CONSTRAINT event_sevamast_pkey PRIMARY KEY (entity_id, seva_code);


--
-- Name: group_items group_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_items
    ADD CONSTRAINT group_items_pkey PRIMARY KEY (entity_id, event_id, group_id, sl);


--
-- Name: group_member_info group_member_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_member_info
    ADD CONSTRAINT group_member_info_pkey PRIMARY KEY (entity_id, event_id, devote_id, sl);


--
-- Name: infra_type infra_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.infra_type
    ADD CONSTRAINT infra_type_pkey PRIMARY KEY (entity_id, event_id, infra_id, infra_type);


--
-- Name: infrastructure infrastructure_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.infrastructure
    ADD CONSTRAINT infrastructure_pkey PRIMARY KEY (entity_id, event_id, infra_id);


--
-- Name: infratype_book infratype_book_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.infratype_book
    ADD CONSTRAINT infratype_book_pkey PRIMARY KEY (entity_id, event_id, infra_id, infra_type, sl);


--
-- Name: momento_distribution momento_disbribution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.momento_distribution
    ADD CONSTRAINT momento_disbribution_pkey PRIMARY KEY (entity_id, event_id, disb_id, momento_id);


--
-- Name: momento_type momento_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.momento_type
    ADD CONSTRAINT momento_type_pkey PRIMARY KEY (entity_id, event_id, momento_id);


--
-- Name: office_bearers office_bearers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.office_bearers
    ADD CONSTRAINT office_bearers_pkey PRIMARY KEY (entity_id, sl);


--
-- Name: role_access role_access_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_access
    ADD CONSTRAINT role_access_pkey PRIMARY KEY (entity_id, role_id);


--
-- Name: rooms_booked rooms_booked_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms_booked
    ADD CONSTRAINT rooms_booked_pkey PRIMARY KEY (entity_id, event_id, booking_id, infra_id, room_number);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (entity_id, event_id, infra_id, room_number);


--
-- Name: seva_booking seva_booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seva_booking
    ADD CONSTRAINT seva_booking_pkey PRIMARY KEY (entity_id, event_id, booking_id, sl);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (entity_id, user_id, role_id);


--
-- PostgreSQL database dump complete
--

