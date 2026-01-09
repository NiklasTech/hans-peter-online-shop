--
-- PostgreSQL database dump
--

\restrict YnwqbVijHvHZ3c9wxKMB9JaVAppfV1rujIVbN3ZeIszb8TikEsvFBVtQHtmdiR4

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Address" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    street text NOT NULL,
    "houseNumber" text NOT NULL,
    city text NOT NULL,
    "postalCode" text NOT NULL,
    "countryCode" text DEFAULT 'DE'::text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    phone text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Address" OWNER TO postgres;

--
-- Name: Address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Address_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Address_id_seq" OWNER TO postgres;

--
-- Name: Address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Address_id_seq" OWNED BY public."Address".id;


--
-- Name: AdminSession; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AdminSession" (
    id text NOT NULL,
    "userId" integer NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AdminSession" OWNER TO postgres;

--
-- Name: Brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Brand" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Brand" OWNER TO postgres;

--
-- Name: Brand_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Brand_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Brand_id_seq" OWNER TO postgres;

--
-- Name: Brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Brand_id_seq" OWNED BY public."Brand".id;


--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CartItem" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO postgres;

--
-- Name: CartItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CartItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."CartItem_id_seq" OWNER TO postgres;

--
-- Name: CartItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CartItem_id_seq" OWNED BY public."CartItem".id;


--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Category_id_seq" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: ChatMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatMessage" (
    id integer NOT NULL,
    "chatId" text NOT NULL,
    "userId" integer NOT NULL,
    content text NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ChatMessage" OWNER TO postgres;

--
-- Name: ChatMessage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ChatMessage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ChatMessage_id_seq" OWNER TO postgres;

--
-- Name: ChatMessage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ChatMessage_id_seq" OWNED BY public."ChatMessage".id;


--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    total double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id integer NOT NULL,
    "orderId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."OrderItem_id_seq" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrderItem_id_seq" OWNED BY public."OrderItem".id;


--
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Order_id_seq" OWNER TO postgres;

--
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    price double precision NOT NULL,
    "previewImage" text,
    stock integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "brandId" integer NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: ProductCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductCategory" (
    "productId" integer NOT NULL,
    "categoryId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ProductCategory" OWNER TO postgres;

--
-- Name: ProductDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductDetail" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProductDetail" OWNER TO postgres;

--
-- Name: ProductDetail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProductDetail_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ProductDetail_id_seq" OWNER TO postgres;

--
-- Name: ProductDetail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProductDetail_id_seq" OWNED BY public."ProductDetail".id;


--
-- Name: ProductImage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductImage" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    index integer DEFAULT 0 NOT NULL,
    url text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ProductImage" OWNER TO postgres;

--
-- Name: ProductImage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProductImage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ProductImage_id_seq" OWNER TO postgres;

--
-- Name: ProductImage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProductImage_id_seq" OWNED BY public."ProductImage".id;


--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Product_id_seq" OWNER TO postgres;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "productId" integer NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    helpful integer DEFAULT 0 NOT NULL,
    title text
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- Name: Review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Review_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Review_id_seq" OWNER TO postgres;

--
-- Name: Review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Review_id_seq" OWNED BY public."Review".id;


--
-- Name: SupportChat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SupportChat" (
    id text NOT NULL,
    "userId" integer NOT NULL,
    status text DEFAULT 'open'::text NOT NULL,
    subject text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SupportChat" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "defaultAddressId" integer,
    "defaultPayment" text,
    "defaultSupplier" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Wishlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Wishlist" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Wishlist" OWNER TO postgres;

--
-- Name: WishlistItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WishlistItem" (
    id integer NOT NULL,
    "wishlistId" integer NOT NULL,
    "productId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WishlistItem" OWNER TO postgres;

--
-- Name: WishlistItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."WishlistItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."WishlistItem_id_seq" OWNER TO postgres;

--
-- Name: WishlistItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."WishlistItem_id_seq" OWNED BY public."WishlistItem".id;


--
-- Name: Wishlist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Wishlist_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Wishlist_id_seq" OWNER TO postgres;

--
-- Name: Wishlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Wishlist_id_seq" OWNED BY public."Wishlist".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Address id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address" ALTER COLUMN id SET DEFAULT nextval('public."Address_id_seq"'::regclass);


--
-- Name: Brand id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Brand" ALTER COLUMN id SET DEFAULT nextval('public."Brand_id_seq"'::regclass);


--
-- Name: CartItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem" ALTER COLUMN id SET DEFAULT nextval('public."CartItem_id_seq"'::regclass);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: ChatMessage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessage" ALTER COLUMN id SET DEFAULT nextval('public."ChatMessage_id_seq"'::regclass);


--
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- Name: OrderItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem" ALTER COLUMN id SET DEFAULT nextval('public."OrderItem_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: ProductDetail id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductDetail" ALTER COLUMN id SET DEFAULT nextval('public."ProductDetail_id_seq"'::regclass);


--
-- Name: ProductImage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductImage" ALTER COLUMN id SET DEFAULT nextval('public."ProductImage_id_seq"'::regclass);


--
-- Name: Review id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review" ALTER COLUMN id SET DEFAULT nextval('public."Review_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: Wishlist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wishlist" ALTER COLUMN id SET DEFAULT nextval('public."Wishlist_id_seq"'::regclass);


--
-- Name: WishlistItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem" ALTER COLUMN id SET DEFAULT nextval('public."WishlistItem_id_seq"'::regclass);


--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Address" (id, "userId", street, "houseNumber", city, "postalCode", "countryCode", "firstName", "lastName", phone, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AdminSession; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AdminSession" (id, "userId", token, "expiresAt", "createdAt") FROM stdin;
cmk6kvhnr00015stv3bvv26fn	17	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyYW5kb20iOjAuNzIwMDAxMjA5MzYwMTAyNSwiaWF0IjoxNzY3OTQ1MTE1fQ.2w7G8XMTB0hy5BhMeSOl2qR_MVfQleX3UHs1XFqsOmA	2026-02-08 07:51:55.427	2026-01-09 07:51:55.431
\.


--
-- Data for Name: Brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Brand" (id, name, description, image, "createdAt", "updatedAt") FROM stdin;
177	ASUS	ASUS Produkte	\N	2026-01-09 07:34:08.801	2026-01-09 07:34:08.801
178	MSI	MSI Produkte	\N	2026-01-09 07:34:08.884	2026-01-09 07:34:08.884
179	Apple	Apple Produkte	\N	2026-01-09 07:34:08.901	2026-01-09 07:34:08.901
180	Samsung	Samsung Produkte	\N	2026-01-09 07:34:08.916	2026-01-09 07:34:08.916
181	LG	LG Produkte	\N	2026-01-09 07:34:08.933	2026-01-09 07:34:08.933
182	Sony	Sony Produkte	\N	2026-01-09 07:34:08.946	2026-01-09 07:34:08.946
183	Logitech	Logitech Produkte	\N	2026-01-09 07:34:08.961	2026-01-09 07:34:08.961
184	NVIDIA	NVIDIA Produkte	\N	2026-01-09 07:34:08.974	2026-01-09 07:34:08.974
185	AMD	AMD Produkte	\N	2026-01-09 07:34:08.987	2026-01-09 07:34:08.987
186	Intel	Intel Produkte	\N	2026-01-09 07:34:08.999	2026-01-09 07:34:08.999
187	Nike	Nike Produkte	\N	2026-01-09 07:34:09.013	2026-01-09 07:34:09.013
188	Adidas	Adidas Produkte	\N	2026-01-09 07:34:09.027	2026-01-09 07:34:09.027
189	Puma	Puma Produkte	\N	2026-01-09 07:34:09.04	2026-01-09 07:34:09.04
190	H&M	H&M Produkte	\N	2026-01-09 07:34:09.053	2026-01-09 07:34:09.053
191	Zara	Zara Produkte	\N	2026-01-09 07:34:09.062	2026-01-09 07:34:09.062
192	Tommy Hilfiger	Tommy Hilfiger Produkte	\N	2026-01-09 07:34:09.074	2026-01-09 07:34:09.074
193	Calvin Klein	Calvin Klein Produkte	\N	2026-01-09 07:34:09.082	2026-01-09 07:34:09.082
194	Levis	Levis Produkte	\N	2026-01-09 07:34:09.09	2026-01-09 07:34:09.09
195	Bosch	Bosch Produkte	\N	2026-01-09 07:34:09.099	2026-01-09 07:34:09.099
196	Siemens	Siemens Produkte	\N	2026-01-09 07:34:09.107	2026-01-09 07:34:09.107
197	Philips	Philips Produkte	\N	2026-01-09 07:34:09.116	2026-01-09 07:34:09.116
198	WMF	WMF Produkte	\N	2026-01-09 07:34:09.126	2026-01-09 07:34:09.126
199	IKEA	IKEA Produkte	\N	2026-01-09 07:34:09.139	2026-01-09 07:34:09.139
200	Under Armour	Under Armour Produkte	\N	2026-01-09 07:34:09.151	2026-01-09 07:34:09.151
201	Reebok	Reebok Produkte	\N	2026-01-09 07:34:09.164	2026-01-09 07:34:09.164
202	Decathlon	Decathlon Produkte	\N	2026-01-09 07:34:09.178	2026-01-09 07:34:09.178
203	Wilson	Wilson Produkte	\N	2026-01-09 07:34:09.187	2026-01-09 07:34:09.187
204	Spalding	Spalding Produkte	\N	2026-01-09 07:34:09.198	2026-01-09 07:34:09.198
205	Penguin	Penguin Produkte	\N	2026-01-09 07:34:09.206	2026-01-09 07:34:09.206
206	Rowohlt	Rowohlt Produkte	\N	2026-01-09 07:34:09.219	2026-01-09 07:34:09.219
207	Suhrkamp	Suhrkamp Produkte	\N	2026-01-09 07:34:09.233	2026-01-09 07:34:09.233
208	Carlsen	Carlsen Produkte	\N	2026-01-09 07:34:09.246	2026-01-09 07:34:09.246
209	Ravensburger	Ravensburger Produkte	\N	2026-01-09 07:34:09.26	2026-01-09 07:34:09.26
210	Hasbro	Hasbro Produkte	\N	2026-01-09 07:34:09.273	2026-01-09 07:34:09.273
211	Mattel	Mattel Produkte	\N	2026-01-09 07:34:09.286	2026-01-09 07:34:09.286
212	LEGO	LEGO Produkte	\N	2026-01-09 07:34:09.298	2026-01-09 07:34:09.298
213	Playmobil	Playmobil Produkte	\N	2026-01-09 07:34:09.311	2026-01-09 07:34:09.311
214	Fisher-Price	Fisher-Price Produkte	\N	2026-01-09 07:34:09.322	2026-01-09 07:34:09.322
215	Gardena	Gardena Produkte	\N	2026-01-09 07:34:09.334	2026-01-09 07:34:09.334
216	Wolf-Garten	Wolf-Garten Produkte	\N	2026-01-09 07:34:09.344	2026-01-09 07:34:09.344
217	Fiskars	Fiskars Produkte	\N	2026-01-09 07:34:09.356	2026-01-09 07:34:09.356
218	Castrol	Castrol Produkte	\N	2026-01-09 07:34:09.366	2026-01-09 07:34:09.366
219	Shell	Shell Produkte	\N	2026-01-09 07:34:09.376	2026-01-09 07:34:09.376
220	3M	3M Produkte	\N	2026-01-09 07:34:09.387	2026-01-09 07:34:09.387
221	L'Oréal	L'Oréal Produkte	\N	2026-01-09 07:34:09.397	2026-01-09 07:34:09.397
222	Nivea	Nivea Produkte	\N	2026-01-09 07:34:09.409	2026-01-09 07:34:09.409
223	Dove	Dove Produkte	\N	2026-01-09 07:34:09.421	2026-01-09 07:34:09.421
224	Garnier	Garnier Produkte	\N	2026-01-09 07:34:09.433	2026-01-09 07:34:09.433
225	Neutrogena	Neutrogena Produkte	\N	2026-01-09 07:34:09.445	2026-01-09 07:34:09.445
226	Maybelline	Maybelline Produkte	\N	2026-01-09 07:34:09.459	2026-01-09 07:34:09.459
227	Nestlé	Nestlé Produkte	\N	2026-01-09 07:34:09.473	2026-01-09 07:34:09.473
228	Jacobs	Jacobs Produkte	\N	2026-01-09 07:34:09.483	2026-01-09 07:34:09.483
229	Edeka	Edeka Produkte	\N	2026-01-09 07:34:09.494	2026-01-09 07:34:09.494
230	Alnatura	Alnatura Produkte	\N	2026-01-09 07:34:09.504	2026-01-09 07:34:09.504
231	Milka	Milka Produkte	\N	2026-01-09 07:34:09.515	2026-01-09 07:34:09.515
232	Lindt	Lindt Produkte	\N	2026-01-09 07:34:09.528	2026-01-09 07:34:09.528
233	Barilla	Barilla Produkte	\N	2026-01-09 07:34:09.542	2026-01-09 07:34:09.542
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CartItem" (id, "userId", "productId", quantity, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, description, image, "createdAt", "updatedAt") FROM stdin;
52	Elektronik	Smartphones, Tablets, Computer und mehr	\N	2026-01-09 07:34:08.557	2026-01-09 07:34:08.557
53	Mode	Kleidung, Schuhe und Accessoires	\N	2026-01-09 07:34:08.64	2026-01-09 07:34:08.64
54	Haushalt	Küche, Bad und Wohnzimmer	\N	2026-01-09 07:34:08.662	2026-01-09 07:34:08.662
55	Sport	Sportgeräte und Fitness	\N	2026-01-09 07:34:08.681	2026-01-09 07:34:08.681
56	Bücher	Romane, Sachbücher und mehr	\N	2026-01-09 07:34:08.697	2026-01-09 07:34:08.697
57	Spielzeug	Spielzeug für Kinder jeden Alters	\N	2026-01-09 07:34:08.712	2026-01-09 07:34:08.712
58	Garten	Gartengeräte und Pflanzen	\N	2026-01-09 07:34:08.726	2026-01-09 07:34:08.726
59	Automobile	Autozubehör und Werkzeug	\N	2026-01-09 07:34:08.742	2026-01-09 07:34:08.742
60	Beauty	Kosmetik und Pflegeprodukte	\N	2026-01-09 07:34:08.759	2026-01-09 07:34:08.759
61	Lebensmittel	Lebensmittel und Getränke	\N	2026-01-09 07:34:08.779	2026-01-09 07:34:08.779
\.


--
-- Data for Name: ChatMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatMessage" (id, "chatId", "userId", content, "isAdmin", "createdAt") FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "userId", status, total, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, "orderId", "productId", quantity, price) FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, name, description, price, "previewImage", stock, "createdAt", "updatedAt", "brandId") FROM stdin;
161	Nike Brasilia	Hochwertiges Rucksack von Nike. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	621.7	https://images.pexels.com/photos/5623083/pexels-photo-5623083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	93	2026-01-09 07:36:15.017	2026-01-09 07:36:15.017	187
162	Philips Deluxe Kaffeemaschine	Hochwertige Kaffeemaschine für perfekten Kaffeegenuss. Einfache Bedienung und konsistente Ergebnisse. Ideal für den täglichen Gebrauch.	297.6	https://images.pexels.com/photos/29502913/pexels-photo-29502913.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	59	2026-01-09 07:36:21.768	2026-01-09 07:36:21.768	197
163	WMF Wasserkocher - Silber	Hochwertiges Wasserkocher von WMF. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	806.45	https://images.pexels.com/photos/8452844/pexels-photo-8452844.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	50	2026-01-09 07:36:28.845	2026-01-09 07:36:28.845	198
164	Philips Plus Staubsauger	Hochwertiges Staubsauger von Philips. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	226.1	https://images.pexels.com/photos/14854352/pexels-photo-14854352.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	72	2026-01-09 07:36:35.488	2026-01-09 07:36:35.488	197
165	IKEA Kivik	Premium Sofa mit erstklassigen Eigenschaften. Von IKEA entwickelt für höchste Ansprüche.	436.53	https://images.pexels.com/photos/32246936/pexels-photo-32246936.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	43	2026-01-09 07:36:42.676	2026-01-09 07:36:42.676	199
166	IKEA Ingatorp	Hochwertiges Tisch von IKEA. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	397.66	https://images.pexels.com/photos/24206917/pexels-photo-24206917.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	66	2026-01-09 07:36:50.545	2026-01-09 07:36:50.545	199
167	IKEA Adde	Hochwertiges Stuhl von IKEA. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	38.13	https://images.pexels.com/photos/422292/pexels-photo-422292.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	41	2026-01-09 07:36:56.999	2026-01-09 07:36:56.999	199
168	IKEA Lampe	IKEA Lampe - Eine ausgezeichnete Wahl für Qualitätsbewusste. Überzeugt durch Funktionalität und Design.	230.88	https://images.pexels.com/photos/34658643/pexels-photo-34658643.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	41	2026-01-09 07:37:04.167	2026-01-09 07:37:04.167	199
169	Reebok Laufschuhe	Performance-Laufschuh mit innovativer Dämpfungstechnologie. Leicht, atmungsaktiv und ideal für lange Distanzen.	209.86	https://images.pexels.com/photos/2404959/pexels-photo-2404959.png?auto=compress&cs=tinysrgb&h=650&w=940	63	2026-01-09 07:37:11.831	2026-01-09 07:37:11.831	201
170	Decathlon Yogamatte	Decathlon Yogamatte - Eine ausgezeichnete Wahl für Qualitätsbewusste. Überzeugt durch Funktionalität und Design.	978.17	https://images.pexels.com/photos/5379145/pexels-photo-5379145.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	29	2026-01-09 07:37:19.03	2026-01-09 07:37:19.03	202
171	Decathlon Plus Hanteln	Decathlon Hanteln - Eine ausgezeichnete Wahl für Qualitätsbewusste. Überzeugt durch Funktionalität und Design.	653.67	https://images.pexels.com/photos/9716149/pexels-photo-9716149.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	17	2026-01-09 07:37:25.801	2026-01-09 07:37:25.801	202
172	Wilson Basketball	Wilson Basketball - Eine ausgezeichnete Wahl für Qualitätsbewusste. Überzeugt durch Funktionalität und Design.	660.96	https://images.pexels.com/photos/10853637/pexels-photo-10853637.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	62	2026-01-09 07:37:32.521	2026-01-09 07:37:32.521	203
173	Puma Fußball	Premium Fußball mit erstklassigen Eigenschaften. Von Puma entwickelt für höchste Ansprüche.	909.52	https://images.pexels.com/photos/13558754/pexels-photo-13558754.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	54	2026-01-09 07:37:39.644	2026-01-09 07:37:39.644	189
174	Decathlon Modern Fahrrad	Premium Fahrrad mit erstklassigen Eigenschaften. Von Decathlon entwickelt für höchste Ansprüche.	357.23	https://images.pexels.com/photos/954539/pexels-photo-954539.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	5	2026-01-09 07:37:46.482	2026-01-09 07:37:46.482	202
175	Penguin Roman	Hochwertiges Roman von Penguin. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	990.64	https://images.pexels.com/photos/34591057/pexels-photo-34591057.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	75	2026-01-09 07:37:53.606	2026-01-09 07:37:53.606	205
176	Suhrkamp Krimi	Hochwertiges Krimi von Suhrkamp. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	346.95	https://images.pexels.com/photos/21036318/pexels-photo-21036318.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	62	2026-01-09 07:38:01.1	2026-01-09 07:38:01.1	207
177	Rowohlt Kochbuch	Premium Kochbuch mit erstklassigen Eigenschaften. Von Rowohlt entwickelt für höchste Ansprüche.	377.08	https://images.pexels.com/photos/19121893/pexels-photo-19121893.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	43	2026-01-09 07:38:08.629	2026-01-09 07:38:08.629	206
178	Ravensburger Puzzle	Hochwertiges Puzzle von Ravensburger. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	51.71	https://images.pexels.com/photos/13537948/pexels-photo-13537948.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	35	2026-01-09 07:38:15.039	2026-01-09 07:38:15.039	209
179	Ravensburger Brettspiel	Premium Brettspiel mit erstklassigen Eigenschaften. Von Ravensburger entwickelt für höchste Ansprüche.	639.49	https://images.pexels.com/photos/3953832/pexels-photo-3953832.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	85	2026-01-09 07:38:22.437	2026-01-09 07:38:22.437	209
180	Playmobil Bauklötze	Playmobil Bauklötze - Eine ausgezeichnete Wahl für Qualitätsbewusste. Überzeugt durch Funktionalität und Design.	258.5	https://images.pexels.com/photos/9819153/pexels-photo-9819153.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	1	2026-01-09 07:38:29.816	2026-01-09 07:38:29.816	213
181	Hasbro Kuscheltier	Premium Kuscheltier mit erstklassigen Eigenschaften. Von Hasbro entwickelt für höchste Ansprüche.	886.96	https://images.pexels.com/photos/18281425/pexels-photo-18281425.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	18	2026-01-09 07:38:37.164	2026-01-09 07:38:37.164	210
182	Wolf-Garten Basic Rasenmäher	Hochwertiges Rasenmäher von Wolf-Garten. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	142.93	https://images.pexels.com/photos/2616165/pexels-photo-2616165.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	96	2026-01-09 07:38:43.81	2026-01-09 07:38:43.81	216
183	Wolf-Garten Gartenschere	Hochwertiges Gartenschere von Wolf-Garten. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	181.62	https://images.pexels.com/photos/105808/pexels-photo-105808.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	70	2026-01-09 07:38:51.194	2026-01-09 07:38:51.194	216
184	Gardena Blumentopf	Hochwertiges Blumentopf von Gardena. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	987.54	https://images.pexels.com/photos/8244420/pexels-photo-8244420.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	32	2026-01-09 07:38:58.584	2026-01-09 07:38:58.584	215
185	Gardena Gartenmöbel	Hochwertiges Gartenmöbel von Gardena. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	460.88	https://images.pexels.com/photos/12047658/pexels-photo-12047658.png?auto=compress&cs=tinysrgb&h=650&w=940	12	2026-01-09 07:39:05.92	2026-01-09 07:39:05.92	215
186	Shell Motoröl	Premium Motoröl mit erstklassigen Eigenschaften. Von Shell entwickelt für höchste Ansprüche.	579.34	https://images.pexels.com/photos/16767580/pexels-photo-16767580.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	22	2026-01-09 07:39:13.125	2026-01-09 07:39:13.125	219
187	3M Deluxe Werkzeugset	3M Werkzeugset - Eine ausgezeichnete Wahl für Qualitätsbewusste. Überzeugt durch Funktionalität und Design.	909.92	https://images.pexels.com/photos/28985978/pexels-photo-28985978.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	99	2026-01-09 07:39:19.809	2026-01-09 07:39:19.809	220
188	Bosch Classic Dashcam	Premium Dashcam mit erstklassigen Eigenschaften. Von Bosch entwickelt für höchste Ansprüche.	706.78	https://images.pexels.com/photos/11112741/pexels-photo-11112741.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	8	2026-01-09 07:39:26.814	2026-01-09 07:39:26.814	195
189	Garnier Basic Shampoo	Professionelles Shampoo für Salon-Ergebnisse zuhause. Optimale Pflege und Glanz. Dermatologisch getestet.	835.01	https://images.pexels.com/photos/20818888/pexels-photo-20818888.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	42	2026-01-09 07:39:33.57	2026-01-09 07:39:33.57	224
190	L'Oréal Gesichtscreme	Hochwertiges Gesichtscreme von L'Oréal. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	511.02	https://images.pexels.com/photos/6371078/pexels-photo-6371078.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	18	2026-01-09 07:39:40.978	2026-01-09 07:39:40.978	221
191	Calvin Klein Basic Parfüm	Calvin Klein Parfüm - Eine ausgezeichnete Wahl für Qualitätsbewusste. Überzeugt durch Funktionalität und Design.	715.9	https://images.pexels.com/photos/19644204/pexels-photo-19644204.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	33	2026-01-09 07:39:48.019	2026-01-09 07:39:48.019	193
192	Maybelline SuperStay Matte Ink	Hochwertiger Lippenstift mit intensiver Farbbrillanz. Langanhaltend und pflegend. Für perfekt geschminkte Lippen den ganzen Tag.	476.32	https://images.pexels.com/photos/19644200/pexels-photo-19644200.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	24	2026-01-09 07:39:54.868	2026-01-09 07:39:54.868	226
193	Edeka Ultra Kaffee	Exzellenter Kaffee für Kenner. Komplexes Aroma und voller Körper. Nachhaltig angebaut und fair gehandelt.	186.39	https://images.pexels.com/photos/32421762/pexels-photo-32421762.png?auto=compress&cs=tinysrgb&h=650&w=940	5	2026-01-09 07:40:01.315	2026-01-09 07:40:01.315	229
144	Sony Vaio SX14	Hochleistungs-Notebook mit brillantem Display. Ideal für kreative Arbeiten, Gaming und Business. Erstklassige Verarbeitung und modernste Technologie.	48.42	https://images.pexels.com/photos/9951392/pexels-photo-9951392.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	37	2026-01-09 07:34:17.051	2026-01-09 07:34:17.051	182
145	Samsung Galaxy A54	Modernste Smartphone-Technologie in elegantem Design. Beeindruckende Kamera, kristallklares Display und blitzschnelle Performance für alle Lebenslagen.	713.62	https://images.pexels.com/photos/4826567/pexels-photo-4826567.png?auto=compress&cs=tinysrgb&h=650&w=940	81	2026-01-09 07:34:24.242	2026-01-09 07:34:24.242	180
146	LG G Pad 5	Hochwertiges Tablet von LG. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	431.55	https://images.pexels.com/photos/11317896/pexels-photo-11317896.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	49	2026-01-09 07:34:31.42	2026-01-09 07:34:31.42	181
147	ASUS TUF Gaming VG27AQ	Premium Display für kreative Profis. Präzise Farbwiedergabe, hohe Auflösung und flexible Anschlussmöglichkeiten. Perfekt für Foto- und Videobearbeitung.	455.02	https://images.pexels.com/photos/1088160/pexels-photo-1088160.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	66	2026-01-09 07:34:38.624	2026-01-09 07:34:38.624	177
148	ASUS TUF Gaming K7	Premium Tastatur mit erstklassigen Eigenschaften. Von ASUS entwickelt für höchste Ansprüche.	911.09	https://images.pexels.com/photos/9069288/pexels-photo-9069288.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	100	2026-01-09 07:34:45.794	2026-01-09 07:34:45.794	177
149	MSI Clutch GM41	Hochwertiges Maus von MSI. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	515.29	https://images.pexels.com/photos/19869754/pexels-photo-19869754.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	50	2026-01-09 07:34:52.212	2026-01-09 07:34:52.212	178
150	Logitech G733	Hochwertiges Headset von Logitech. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	522.71	https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	20	2026-01-09 07:34:59.224	2026-01-09 07:34:59.224	183
151	Logitech C920	Logitech Webcam - Eine ausgezeichnete Wahl für Qualitätsbewusste. Überzeugt durch Funktionalität und Design.	467.47	https://images.pexels.com/photos/2445781/pexels-photo-2445781.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	7	2026-01-09 07:35:06.327	2026-01-09 07:35:06.327	183
152	LG Smart Ink Tank	Hochwertiges Drucker von LG. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	687.39	https://images.pexels.com/photos/32079592/pexels-photo-32079592.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	63	2026-01-09 07:35:13.315	2026-01-09 07:35:13.315	181
153	ASUS RT-AX88U	Premium Router mit erstklassigen Eigenschaften. Von ASUS entwickelt für höchste Ansprüche.	299.71	https://images.pexels.com/photos/28977814/pexels-photo-28977814.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	40	2026-01-09 07:35:19.702	2026-01-09 07:35:19.702	177
154	H&M T-Shirt	H&M T-Shirt - Eine ausgezeichnete Wahl für Qualitätsbewusste. Überzeugt durch Funktionalität und Design.	760.62	https://images.pexels.com/photos/29346718/pexels-photo-29346718.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	18	2026-01-09 07:35:26.502	2026-01-09 07:35:26.502	190
155	H&M Premium Hemd	Premium Hemd mit erstklassigen Eigenschaften. Von H&M entwickelt für höchste Ansprüche.	704.4	https://images.pexels.com/photos/18363605/pexels-photo-18363605.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	53	2026-01-09 07:35:33.543	2026-01-09 07:35:33.543	190
156	Tommy Hilfiger Deluxe Jeans	Stilvolle Jeans mit modernem Schnitt. Nachhaltig produziert und langlebig. Perfekter Sitz garantiert.	25.11	https://images.pexels.com/photos/1879096/pexels-photo-1879096.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	99	2026-01-09 07:35:40.385	2026-01-09 07:35:40.385	192
157	Nike Windrunner	Hochwertiges Jacke von Nike. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	557.42	https://images.pexels.com/photos/29783660/pexels-photo-29783660.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	42	2026-01-09 07:35:47.495	2026-01-09 07:35:47.495	187
158	Puma Plus Sneaker	Premium Sneaker mit ikonischem Look. Hochwertige Materialien und erstklassige Verarbeitung. Ein Must-Have für jeden Sneaker-Fan.	904.57	https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	4	2026-01-09 07:35:54.461	2026-01-09 07:35:54.461	189
159	Nike Classic Stiefel	Premium Stiefel mit erstklassigen Eigenschaften. Von Nike entwickelt für höchste Ansprüche.	235.12	https://images.pexels.com/photos/11112741/pexels-photo-11112741.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	72	2026-01-09 07:36:01.226	2026-01-09 07:36:01.226	187
160	Puma Tasche	Puma Tasche - Eine ausgezeichnete Wahl für Qualitätsbewusste. Überzeugt durch Funktionalität und Design.	976.03	https://images.pexels.com/photos/7351208/pexels-photo-7351208.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	95	2026-01-09 07:36:08.594	2026-01-09 07:36:08.594	189
194	Nestlé Pro Tee	Hochwertiges Tee von Nestlé. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	276.24	https://images.pexels.com/photos/34799631/pexels-photo-34799631.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	48	2026-01-09 07:40:07.915	2026-01-09 07:40:07.915	227
195	Milka Oreo	Feinste Schokolade aus hochwertigen Kakaobohnen. Zartschmelzend und intensiv im Geschmack. Ein Genuss für besondere Momente.	432.92	https://images.pexels.com/photos/19087694/pexels-photo-19087694.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	43	2026-01-09 07:40:14.624	2026-01-09 07:40:14.624	231
196	Barilla Olivenöl	Hochwertiges Olivenöl von Barilla. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.	541.77	https://images.pexels.com/photos/4041098/pexels-photo-4041098.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	55	2026-01-09 07:40:22.017	2026-01-09 07:40:22.017	233
\.


--
-- Data for Name: ProductCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductCategory" ("productId", "categoryId", "createdAt") FROM stdin;
161	53	2026-01-09 07:36:15.017
162	54	2026-01-09 07:36:21.768
163	54	2026-01-09 07:36:28.845
164	54	2026-01-09 07:36:35.488
165	54	2026-01-09 07:36:42.676
166	54	2026-01-09 07:36:50.545
167	54	2026-01-09 07:36:56.999
168	54	2026-01-09 07:37:04.167
169	55	2026-01-09 07:37:11.831
170	55	2026-01-09 07:37:19.03
171	55	2026-01-09 07:37:25.801
172	55	2026-01-09 07:37:32.521
173	55	2026-01-09 07:37:39.644
174	55	2026-01-09 07:37:46.482
175	56	2026-01-09 07:37:53.606
176	56	2026-01-09 07:38:01.1
177	56	2026-01-09 07:38:08.629
178	57	2026-01-09 07:38:15.039
179	57	2026-01-09 07:38:22.437
180	57	2026-01-09 07:38:29.816
181	57	2026-01-09 07:38:37.164
182	58	2026-01-09 07:38:43.81
183	58	2026-01-09 07:38:51.194
184	58	2026-01-09 07:38:58.584
185	58	2026-01-09 07:39:05.92
186	59	2026-01-09 07:39:13.125
187	59	2026-01-09 07:39:19.809
188	59	2026-01-09 07:39:26.814
189	60	2026-01-09 07:39:33.57
190	60	2026-01-09 07:39:40.978
191	60	2026-01-09 07:39:48.019
192	60	2026-01-09 07:39:54.868
193	61	2026-01-09 07:40:01.315
194	61	2026-01-09 07:40:07.915
195	61	2026-01-09 07:40:14.624
196	61	2026-01-09 07:40:22.017
144	52	2026-01-09 07:34:17.051
145	52	2026-01-09 07:34:24.242
146	52	2026-01-09 07:34:31.42
147	52	2026-01-09 07:34:38.624
148	52	2026-01-09 07:34:45.794
149	52	2026-01-09 07:34:52.212
150	52	2026-01-09 07:34:59.224
151	52	2026-01-09 07:35:06.327
152	52	2026-01-09 07:35:13.315
153	52	2026-01-09 07:35:19.702
154	53	2026-01-09 07:35:26.502
155	53	2026-01-09 07:35:33.543
156	53	2026-01-09 07:35:40.385
157	53	2026-01-09 07:35:47.495
158	53	2026-01-09 07:35:54.461
159	53	2026-01-09 07:36:01.226
160	53	2026-01-09 07:36:08.594
\.


--
-- Data for Name: ProductDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductDetail" (id, "productId", key, value, "createdAt", "updatedAt") FROM stdin;
702	144	Marke	Sony	2026-01-09 07:34:17.051	2026-01-09 07:34:17.051
703	144	Verfügbarkeit	Auf Lager	2026-01-09 07:34:17.051	2026-01-09 07:34:17.051
704	144	Lieferzeit	2-3 Werktage	2026-01-09 07:34:17.051	2026-01-09 07:34:17.051
705	144	Prozessor	AMD Ryzen 9	2026-01-09 07:34:17.051	2026-01-09 07:34:17.051
706	144	RAM	64 GB	2026-01-09 07:34:17.051	2026-01-09 07:34:17.051
707	144	Speicher	1 TB SSD	2026-01-09 07:34:17.051	2026-01-09 07:34:17.051
708	144	Display	15.6" Full HD	2026-01-09 07:34:17.051	2026-01-09 07:34:17.051
709	144	Grafikkarte	Integriert	2026-01-09 07:34:17.051	2026-01-09 07:34:17.051
710	144	Gewicht	2.5 kg	2026-01-09 07:34:17.051	2026-01-09 07:34:17.051
711	145	Marke	Samsung	2026-01-09 07:34:24.242	2026-01-09 07:34:24.242
712	145	Verfügbarkeit	Auf Lager	2026-01-09 07:34:24.242	2026-01-09 07:34:24.242
713	145	Lieferzeit	1-2 Werktage	2026-01-09 07:34:24.242	2026-01-09 07:34:24.242
714	145	Display	6.7" Super Retina	2026-01-09 07:34:24.242	2026-01-09 07:34:24.242
715	145	Speicher	1 TB	2026-01-09 07:34:24.242	2026-01-09 07:34:24.242
716	145	RAM	12 GB	2026-01-09 07:34:24.242	2026-01-09 07:34:24.242
717	145	Kamera	108 MP Quad-Kamera	2026-01-09 07:34:24.242	2026-01-09 07:34:24.242
718	145	Akku	5500 mAh	2026-01-09 07:34:24.242	2026-01-09 07:34:24.242
719	145	Gewicht	208 g	2026-01-09 07:34:24.242	2026-01-09 07:34:24.242
720	146	Marke	LG	2026-01-09 07:34:31.42	2026-01-09 07:34:31.42
721	146	Verfügbarkeit	Auf Lager	2026-01-09 07:34:31.42	2026-01-09 07:34:31.42
722	146	Lieferzeit	2-3 Werktage	2026-01-09 07:34:31.42	2026-01-09 07:34:31.42
723	146	Display	11" LCD	2026-01-09 07:34:31.42	2026-01-09 07:34:31.42
724	146	Speicher	512 GB	2026-01-09 07:34:31.42	2026-01-09 07:34:31.42
725	146	RAM	8 GB	2026-01-09 07:34:31.42	2026-01-09 07:34:31.42
726	146	Akku	8000 mAh	2026-01-09 07:34:31.42	2026-01-09 07:34:31.42
727	146	Gewicht	649 g	2026-01-09 07:34:31.42	2026-01-09 07:34:31.42
728	147	Marke	ASUS	2026-01-09 07:34:38.624	2026-01-09 07:34:38.624
729	147	Verfügbarkeit	Auf Lager	2026-01-09 07:34:38.624	2026-01-09 07:34:38.624
730	147	Lieferzeit	2-3 Werktage	2026-01-09 07:34:38.624	2026-01-09 07:34:38.624
731	147	Größe	32"	2026-01-09 07:34:38.624	2026-01-09 07:34:38.624
732	147	Auflösung	2560x1440 (QHD)	2026-01-09 07:34:38.624	2026-01-09 07:34:38.624
733	147	Panel-Typ	OLED	2026-01-09 07:34:38.624	2026-01-09 07:34:38.624
734	147	Bildwiederholrate	144 Hz	2026-01-09 07:34:38.624	2026-01-09 07:34:38.624
735	147	Reaktionszeit	1 ms	2026-01-09 07:34:38.624	2026-01-09 07:34:38.624
736	148	Marke	ASUS	2026-01-09 07:34:45.794	2026-01-09 07:34:45.794
737	148	Verfügbarkeit	Auf Lager	2026-01-09 07:34:45.794	2026-01-09 07:34:45.794
738	148	Lieferzeit	2-3 Werktage	2026-01-09 07:34:45.794	2026-01-09 07:34:45.794
739	148	Typ	Mechanisch	2026-01-09 07:34:45.794	2026-01-09 07:34:45.794
740	148	Switches	Cherry MX Red	2026-01-09 07:34:45.794	2026-01-09 07:34:45.794
741	148	RGB	Per-Key RGB	2026-01-09 07:34:45.794	2026-01-09 07:34:45.794
742	148	Anschluss	USB-A	2026-01-09 07:34:45.794	2026-01-09 07:34:45.794
743	149	Marke	MSI	2026-01-09 07:34:52.212	2026-01-09 07:34:52.212
744	149	Verfügbarkeit	Auf Lager	2026-01-09 07:34:52.212	2026-01-09 07:34:52.212
745	149	Lieferzeit	2-3 Werktage	2026-01-09 07:34:52.212	2026-01-09 07:34:52.212
746	149	Sensor	Laser	2026-01-09 07:34:52.212	2026-01-09 07:34:52.212
747	149	DPI	25600	2026-01-09 07:34:52.212	2026-01-09 07:34:52.212
748	149	Tasten	11	2026-01-09 07:34:52.212	2026-01-09 07:34:52.212
749	149	Anschluss	Wireless	2026-01-09 07:34:52.212	2026-01-09 07:34:52.212
750	149	Gewicht	78 g	2026-01-09 07:34:52.212	2026-01-09 07:34:52.212
751	150	Marke	Logitech	2026-01-09 07:34:59.224	2026-01-09 07:34:59.224
752	150	Verfügbarkeit	Auf Lager	2026-01-09 07:34:59.224	2026-01-09 07:34:59.224
753	150	Lieferzeit	3-5 Werktage	2026-01-09 07:34:59.224	2026-01-09 07:34:59.224
754	150	Typ	In-Ear	2026-01-09 07:34:59.224	2026-01-09 07:34:59.224
755	150	Anschluss	Bluetooth	2026-01-09 07:34:59.224	2026-01-09 07:34:59.224
756	150	Surround	Dolby Atmos	2026-01-09 07:34:59.224	2026-01-09 07:34:59.224
757	150	Mikrofon	Integriert, Noise-Cancelling	2026-01-09 07:34:59.224	2026-01-09 07:34:59.224
758	150	Akkulaufzeit	40h	2026-01-09 07:34:59.224	2026-01-09 07:34:59.224
759	151	Marke	Logitech	2026-01-09 07:35:06.327	2026-01-09 07:35:06.327
760	151	Verfügbarkeit	Auf Lager	2026-01-09 07:35:06.327	2026-01-09 07:35:06.327
761	151	Lieferzeit	1-2 Werktage	2026-01-09 07:35:06.327	2026-01-09 07:35:06.327
762	152	Marke	LG	2026-01-09 07:35:13.315	2026-01-09 07:35:13.315
763	152	Verfügbarkeit	Auf Lager	2026-01-09 07:35:13.315	2026-01-09 07:35:13.315
764	152	Lieferzeit	2-3 Werktage	2026-01-09 07:35:13.315	2026-01-09 07:35:13.315
765	153	Marke	ASUS	2026-01-09 07:35:19.702	2026-01-09 07:35:19.702
766	153	Verfügbarkeit	Auf Lager	2026-01-09 07:35:19.702	2026-01-09 07:35:19.702
767	153	Lieferzeit	1-2 Werktage	2026-01-09 07:35:19.702	2026-01-09 07:35:19.702
768	154	Marke	H&M	2026-01-09 07:35:26.502	2026-01-09 07:35:26.502
769	154	Verfügbarkeit	Auf Lager	2026-01-09 07:35:26.502	2026-01-09 07:35:26.502
770	154	Lieferzeit	1-2 Werktage	2026-01-09 07:35:26.502	2026-01-09 07:35:26.502
771	154	Material	Polyester	2026-01-09 07:35:26.502	2026-01-09 07:35:26.502
772	154	Schnitt	Slim Fit	2026-01-09 07:35:26.502	2026-01-09 07:35:26.502
773	154	Größen	XS-XXL	2026-01-09 07:35:26.502	2026-01-09 07:35:26.502
774	154	Pflege	Maschinenwäsche 30°C	2026-01-09 07:35:26.502	2026-01-09 07:35:26.502
775	155	Marke	H&M	2026-01-09 07:35:33.543	2026-01-09 07:35:33.543
776	155	Verfügbarkeit	Auf Lager	2026-01-09 07:35:33.543	2026-01-09 07:35:33.543
777	155	Lieferzeit	Sofort lieferbar	2026-01-09 07:35:33.543	2026-01-09 07:35:33.543
778	156	Marke	Tommy Hilfiger	2026-01-09 07:35:40.385	2026-01-09 07:35:40.385
779	156	Verfügbarkeit	Auf Lager	2026-01-09 07:35:40.385	2026-01-09 07:35:40.385
780	156	Lieferzeit	Sofort lieferbar	2026-01-09 07:35:40.385	2026-01-09 07:35:40.385
781	156	Material	98% Baumwolle, 2% Elasthan	2026-01-09 07:35:40.385	2026-01-09 07:35:40.385
782	156	Schnitt	Skinny	2026-01-09 07:35:40.385	2026-01-09 07:35:40.385
783	156	Größen	W28-W40	2026-01-09 07:35:40.385	2026-01-09 07:35:40.385
784	156	Waschung	Dark Wash	2026-01-09 07:35:40.385	2026-01-09 07:35:40.385
785	157	Marke	Nike	2026-01-09 07:35:47.495	2026-01-09 07:35:47.495
786	157	Verfügbarkeit	Auf Lager	2026-01-09 07:35:47.495	2026-01-09 07:35:47.495
787	157	Lieferzeit	2-3 Werktage	2026-01-09 07:35:47.495	2026-01-09 07:35:47.495
788	158	Marke	Puma	2026-01-09 07:35:54.461	2026-01-09 07:35:54.461
789	158	Verfügbarkeit	Auf Lager	2026-01-09 07:35:54.461	2026-01-09 07:35:54.461
790	158	Lieferzeit	3-5 Werktage	2026-01-09 07:35:54.461	2026-01-09 07:35:54.461
791	158	Material	Canvas	2026-01-09 07:35:54.461	2026-01-09 07:35:54.461
792	158	Sohle	Boost-Technologie	2026-01-09 07:35:54.461	2026-01-09 07:35:54.461
793	158	Größen	36-47	2026-01-09 07:35:54.461	2026-01-09 07:35:54.461
794	158	Farben	Blau/Grau	2026-01-09 07:35:54.461	2026-01-09 07:35:54.461
795	159	Marke	Nike	2026-01-09 07:36:01.226	2026-01-09 07:36:01.226
796	159	Verfügbarkeit	Auf Lager	2026-01-09 07:36:01.226	2026-01-09 07:36:01.226
797	159	Lieferzeit	1-2 Werktage	2026-01-09 07:36:01.226	2026-01-09 07:36:01.226
798	160	Marke	Puma	2026-01-09 07:36:08.594	2026-01-09 07:36:08.594
799	160	Verfügbarkeit	Auf Lager	2026-01-09 07:36:08.594	2026-01-09 07:36:08.594
800	160	Lieferzeit	1-2 Werktage	2026-01-09 07:36:08.594	2026-01-09 07:36:08.594
801	161	Marke	Nike	2026-01-09 07:36:15.017	2026-01-09 07:36:15.017
802	161	Verfügbarkeit	Auf Lager	2026-01-09 07:36:15.017	2026-01-09 07:36:15.017
803	161	Lieferzeit	3-5 Werktage	2026-01-09 07:36:15.017	2026-01-09 07:36:15.017
804	162	Marke	Philips	2026-01-09 07:36:21.768	2026-01-09 07:36:21.768
805	162	Verfügbarkeit	Auf Lager	2026-01-09 07:36:21.768	2026-01-09 07:36:21.768
806	162	Lieferzeit	1-2 Werktage	2026-01-09 07:36:21.768	2026-01-09 07:36:21.768
807	162	Typ	Vollautom at	2026-01-09 07:36:21.768	2026-01-09 07:36:21.768
808	162	Fassungsvermögen	1.5 L	2026-01-09 07:36:21.768	2026-01-09 07:36:21.768
809	162	Leistung	1491 W	2026-01-09 07:36:21.768	2026-01-09 07:36:21.768
810	162	Druck	15 bar	2026-01-09 07:36:21.768	2026-01-09 07:36:21.768
811	163	Marke	WMF	2026-01-09 07:36:28.845	2026-01-09 07:36:28.845
812	163	Verfügbarkeit	Auf Lager	2026-01-09 07:36:28.845	2026-01-09 07:36:28.845
813	163	Lieferzeit	3-5 Werktage	2026-01-09 07:36:28.845	2026-01-09 07:36:28.845
814	164	Marke	Philips	2026-01-09 07:36:35.488	2026-01-09 07:36:35.488
815	164	Verfügbarkeit	Auf Lager	2026-01-09 07:36:35.488	2026-01-09 07:36:35.488
816	164	Lieferzeit	Sofort lieferbar	2026-01-09 07:36:35.488	2026-01-09 07:36:35.488
817	165	Marke	IKEA	2026-01-09 07:36:42.676	2026-01-09 07:36:42.676
818	165	Verfügbarkeit	Auf Lager	2026-01-09 07:36:42.676	2026-01-09 07:36:42.676
819	165	Lieferzeit	3-5 Werktage	2026-01-09 07:36:42.676	2026-01-09 07:36:42.676
820	166	Marke	IKEA	2026-01-09 07:36:50.545	2026-01-09 07:36:50.545
821	166	Verfügbarkeit	Auf Lager	2026-01-09 07:36:50.545	2026-01-09 07:36:50.545
822	166	Lieferzeit	3-5 Werktage	2026-01-09 07:36:50.545	2026-01-09 07:36:50.545
823	167	Marke	IKEA	2026-01-09 07:36:56.999	2026-01-09 07:36:56.999
824	167	Verfügbarkeit	Auf Lager	2026-01-09 07:36:56.999	2026-01-09 07:36:56.999
825	167	Lieferzeit	1-2 Werktage	2026-01-09 07:36:56.999	2026-01-09 07:36:56.999
826	168	Marke	IKEA	2026-01-09 07:37:04.167	2026-01-09 07:37:04.167
827	168	Verfügbarkeit	Auf Lager	2026-01-09 07:37:04.167	2026-01-09 07:37:04.167
828	168	Lieferzeit	3-5 Werktage	2026-01-09 07:37:04.167	2026-01-09 07:37:04.167
829	169	Marke	Reebok	2026-01-09 07:37:11.831	2026-01-09 07:37:11.831
830	169	Verfügbarkeit	Auf Lager	2026-01-09 07:37:11.831	2026-01-09 07:37:11.831
831	169	Lieferzeit	1-2 Werktage	2026-01-09 07:37:11.831	2026-01-09 07:37:11.831
832	169	Sohle	React Foam	2026-01-09 07:37:11.831	2026-01-09 07:37:11.831
833	169	Dämpfung	Neutral	2026-01-09 07:37:11.831	2026-01-09 07:37:11.831
834	169	Gewicht	272 g	2026-01-09 07:37:11.831	2026-01-09 07:37:11.831
835	169	Einsatz	Wettkampf	2026-01-09 07:37:11.831	2026-01-09 07:37:11.831
836	170	Marke	Decathlon	2026-01-09 07:37:19.03	2026-01-09 07:37:19.03
837	170	Verfügbarkeit	Auf Lager	2026-01-09 07:37:19.03	2026-01-09 07:37:19.03
838	170	Lieferzeit	Sofort lieferbar	2026-01-09 07:37:19.03	2026-01-09 07:37:19.03
839	171	Marke	Decathlon	2026-01-09 07:37:25.801	2026-01-09 07:37:25.801
840	171	Verfügbarkeit	Auf Lager	2026-01-09 07:37:25.801	2026-01-09 07:37:25.801
841	171	Lieferzeit	2-3 Werktage	2026-01-09 07:37:25.801	2026-01-09 07:37:25.801
842	172	Marke	Wilson	2026-01-09 07:37:32.521	2026-01-09 07:37:32.521
843	172	Verfügbarkeit	Auf Lager	2026-01-09 07:37:32.521	2026-01-09 07:37:32.521
844	172	Lieferzeit	1-2 Werktage	2026-01-09 07:37:32.521	2026-01-09 07:37:32.521
845	173	Marke	Puma	2026-01-09 07:37:39.644	2026-01-09 07:37:39.644
846	173	Verfügbarkeit	Auf Lager	2026-01-09 07:37:39.644	2026-01-09 07:37:39.644
847	173	Lieferzeit	3-5 Werktage	2026-01-09 07:37:39.644	2026-01-09 07:37:39.644
848	174	Marke	Decathlon	2026-01-09 07:37:46.482	2026-01-09 07:37:46.482
849	174	Verfügbarkeit	Auf Lager	2026-01-09 07:37:46.482	2026-01-09 07:37:46.482
850	174	Lieferzeit	1-2 Werktage	2026-01-09 07:37:46.482	2026-01-09 07:37:46.482
851	175	Marke	Penguin	2026-01-09 07:37:53.606	2026-01-09 07:37:53.606
852	175	Verfügbarkeit	Auf Lager	2026-01-09 07:37:53.606	2026-01-09 07:37:53.606
853	175	Lieferzeit	2-3 Werktage	2026-01-09 07:37:53.606	2026-01-09 07:37:53.606
854	176	Marke	Suhrkamp	2026-01-09 07:38:01.1	2026-01-09 07:38:01.1
855	176	Verfügbarkeit	Auf Lager	2026-01-09 07:38:01.1	2026-01-09 07:38:01.1
856	176	Lieferzeit	2-3 Werktage	2026-01-09 07:38:01.1	2026-01-09 07:38:01.1
857	177	Marke	Rowohlt	2026-01-09 07:38:08.629	2026-01-09 07:38:08.629
858	177	Verfügbarkeit	Auf Lager	2026-01-09 07:38:08.629	2026-01-09 07:38:08.629
859	177	Lieferzeit	3-5 Werktage	2026-01-09 07:38:08.629	2026-01-09 07:38:08.629
860	178	Marke	Ravensburger	2026-01-09 07:38:15.039	2026-01-09 07:38:15.039
861	178	Verfügbarkeit	Auf Lager	2026-01-09 07:38:15.039	2026-01-09 07:38:15.039
862	178	Lieferzeit	3-5 Werktage	2026-01-09 07:38:15.039	2026-01-09 07:38:15.039
863	178	Teile	1500	2026-01-09 07:38:15.039	2026-01-09 07:38:15.039
864	178	Größe	70x50 cm	2026-01-09 07:38:15.039	2026-01-09 07:38:15.039
865	178	Altersempfehlung	Ab 12 Jahren	2026-01-09 07:38:15.039	2026-01-09 07:38:15.039
866	178	Material	Hochwertige Pappe	2026-01-09 07:38:15.039	2026-01-09 07:38:15.039
867	179	Marke	Ravensburger	2026-01-09 07:38:22.437	2026-01-09 07:38:22.437
868	179	Verfügbarkeit	Auf Lager	2026-01-09 07:38:22.437	2026-01-09 07:38:22.437
869	179	Lieferzeit	2-3 Werktage	2026-01-09 07:38:22.437	2026-01-09 07:38:22.437
870	179	Spieler	3-8	2026-01-09 07:38:22.437	2026-01-09 07:38:22.437
871	179	Spieldauer	60 Min	2026-01-09 07:38:22.437	2026-01-09 07:38:22.437
872	179	Altersempfehlung	Ab 6 Jahren	2026-01-09 07:38:22.437	2026-01-09 07:38:22.437
873	179	Sprache	Deutsch	2026-01-09 07:38:22.437	2026-01-09 07:38:22.437
874	180	Marke	Playmobil	2026-01-09 07:38:29.816	2026-01-09 07:38:29.816
875	180	Verfügbarkeit	Auf Lager	2026-01-09 07:38:29.816	2026-01-09 07:38:29.816
876	180	Lieferzeit	3-5 Werktage	2026-01-09 07:38:29.816	2026-01-09 07:38:29.816
877	181	Marke	Hasbro	2026-01-09 07:38:37.164	2026-01-09 07:38:37.164
878	181	Verfügbarkeit	Auf Lager	2026-01-09 07:38:37.164	2026-01-09 07:38:37.164
879	181	Lieferzeit	Sofort lieferbar	2026-01-09 07:38:37.164	2026-01-09 07:38:37.164
880	182	Marke	Wolf-Garten	2026-01-09 07:38:43.81	2026-01-09 07:38:43.81
881	182	Verfügbarkeit	Auf Lager	2026-01-09 07:38:43.81	2026-01-09 07:38:43.81
882	182	Lieferzeit	2-3 Werktage	2026-01-09 07:38:43.81	2026-01-09 07:38:43.81
883	183	Marke	Wolf-Garten	2026-01-09 07:38:51.194	2026-01-09 07:38:51.194
884	183	Verfügbarkeit	Auf Lager	2026-01-09 07:38:51.194	2026-01-09 07:38:51.194
885	183	Lieferzeit	1-2 Werktage	2026-01-09 07:38:51.194	2026-01-09 07:38:51.194
886	184	Marke	Gardena	2026-01-09 07:38:58.584	2026-01-09 07:38:58.584
887	184	Verfügbarkeit	Auf Lager	2026-01-09 07:38:58.584	2026-01-09 07:38:58.584
888	184	Lieferzeit	1-2 Werktage	2026-01-09 07:38:58.584	2026-01-09 07:38:58.584
889	185	Marke	Gardena	2026-01-09 07:39:05.92	2026-01-09 07:39:05.92
890	185	Verfügbarkeit	Auf Lager	2026-01-09 07:39:05.92	2026-01-09 07:39:05.92
891	185	Lieferzeit	1-2 Werktage	2026-01-09 07:39:05.92	2026-01-09 07:39:05.92
892	186	Marke	Shell	2026-01-09 07:39:13.125	2026-01-09 07:39:13.125
893	186	Verfügbarkeit	Auf Lager	2026-01-09 07:39:13.125	2026-01-09 07:39:13.125
894	186	Lieferzeit	1-2 Werktage	2026-01-09 07:39:13.125	2026-01-09 07:39:13.125
895	187	Marke	3M	2026-01-09 07:39:19.809	2026-01-09 07:39:19.809
896	187	Verfügbarkeit	Auf Lager	2026-01-09 07:39:19.809	2026-01-09 07:39:19.809
897	187	Lieferzeit	3-5 Werktage	2026-01-09 07:39:19.809	2026-01-09 07:39:19.809
898	188	Marke	Bosch	2026-01-09 07:39:26.814	2026-01-09 07:39:26.814
899	188	Verfügbarkeit	Auf Lager	2026-01-09 07:39:26.814	2026-01-09 07:39:26.814
900	188	Lieferzeit	3-5 Werktage	2026-01-09 07:39:26.814	2026-01-09 07:39:26.814
901	189	Marke	Garnier	2026-01-09 07:39:33.57	2026-01-09 07:39:33.57
902	189	Verfügbarkeit	Auf Lager	2026-01-09 07:39:33.57	2026-01-09 07:39:33.57
903	189	Lieferzeit	3-5 Werktage	2026-01-09 07:39:33.57	2026-01-09 07:39:33.57
904	189	Haartyp	Fettiges Haar	2026-01-09 07:39:33.57	2026-01-09 07:39:33.57
905	189	Inhalt	500 ml	2026-01-09 07:39:33.57	2026-01-09 07:39:33.57
906	189	Silikonfrei	Ja	2026-01-09 07:39:33.57	2026-01-09 07:39:33.57
907	189	pH-Wert	5.5	2026-01-09 07:39:33.57	2026-01-09 07:39:33.57
908	190	Marke	L'Oréal	2026-01-09 07:39:40.978	2026-01-09 07:39:40.978
909	190	Verfügbarkeit	Auf Lager	2026-01-09 07:39:40.978	2026-01-09 07:39:40.978
910	190	Lieferzeit	2-3 Werktage	2026-01-09 07:39:40.978	2026-01-09 07:39:40.978
911	191	Marke	Calvin Klein	2026-01-09 07:39:48.019	2026-01-09 07:39:48.019
912	191	Verfügbarkeit	Auf Lager	2026-01-09 07:39:48.019	2026-01-09 07:39:48.019
913	191	Lieferzeit	3-5 Werktage	2026-01-09 07:39:48.019	2026-01-09 07:39:48.019
914	192	Marke	Maybelline	2026-01-09 07:39:54.868	2026-01-09 07:39:54.868
915	192	Verfügbarkeit	Auf Lager	2026-01-09 07:39:54.868	2026-01-09 07:39:54.868
916	192	Lieferzeit	3-5 Werktage	2026-01-09 07:39:54.868	2026-01-09 07:39:54.868
917	192	Finish	Matt	2026-01-09 07:39:54.868	2026-01-09 07:39:54.868
918	192	Haltbarkeit	Bis zu 8h	2026-01-09 07:39:54.868	2026-01-09 07:39:54.868
919	192	Inhalt	3.5 g	2026-01-09 07:39:54.868	2026-01-09 07:39:54.868
920	192	Vegan	Nein	2026-01-09 07:39:54.868	2026-01-09 07:39:54.868
921	193	Marke	Edeka	2026-01-09 07:40:01.315	2026-01-09 07:40:01.315
922	193	Verfügbarkeit	Auf Lager	2026-01-09 07:40:01.315	2026-01-09 07:40:01.315
923	193	Lieferzeit	2-3 Werktage	2026-01-09 07:40:01.315	2026-01-09 07:40:01.315
924	193	Röstgrad	Hell	2026-01-09 07:40:01.315	2026-01-09 07:40:01.315
925	193	Herkunft	Äthiopien	2026-01-09 07:40:01.315	2026-01-09 07:40:01.315
926	193	Inhalt	1000 g	2026-01-09 07:40:01.315	2026-01-09 07:40:01.315
927	193	Form	Kapseln	2026-01-09 07:40:01.315	2026-01-09 07:40:01.315
928	194	Marke	Nestlé	2026-01-09 07:40:07.915	2026-01-09 07:40:07.915
929	194	Verfügbarkeit	Auf Lager	2026-01-09 07:40:07.915	2026-01-09 07:40:07.915
930	194	Lieferzeit	1-2 Werktage	2026-01-09 07:40:07.915	2026-01-09 07:40:07.915
931	194	Sorte	Schwarztee	2026-01-09 07:40:07.915	2026-01-09 07:40:07.915
932	194	Inhalt	20 Beutel	2026-01-09 07:40:07.915	2026-01-09 07:40:07.915
933	194	Bio	Ja	2026-01-09 07:40:07.915	2026-01-09 07:40:07.915
934	195	Marke	Milka	2026-01-09 07:40:14.624	2026-01-09 07:40:14.624
935	195	Verfügbarkeit	Auf Lager	2026-01-09 07:40:14.624	2026-01-09 07:40:14.624
936	195	Lieferzeit	Sofort lieferbar	2026-01-09 07:40:14.624	2026-01-09 07:40:14.624
937	195	Kakaoanteil	70%	2026-01-09 07:40:14.624	2026-01-09 07:40:14.624
938	195	Gewicht	200 g	2026-01-09 07:40:14.624	2026-01-09 07:40:14.624
939	195	Zutaten	Kakaomasse, Zucker, Kakaobutter, Emulgator	2026-01-09 07:40:14.624	2026-01-09 07:40:14.624
940	195	Allergene	Kann Spuren von Nüssen enthalten	2026-01-09 07:40:14.624	2026-01-09 07:40:14.624
941	196	Marke	Barilla	2026-01-09 07:40:22.017	2026-01-09 07:40:22.017
942	196	Verfügbarkeit	Auf Lager	2026-01-09 07:40:22.017	2026-01-09 07:40:22.017
943	196	Lieferzeit	2-3 Werktage	2026-01-09 07:40:22.017	2026-01-09 07:40:22.017
\.


--
-- Data for Name: ProductImage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductImage" (id, "productId", index, url, "createdAt") FROM stdin;
427	144	0	https://images.pexels.com/photos/19577867/pexels-photo-19577867.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:17.051
428	144	1	https://images.pexels.com/photos/7431638/pexels-photo-7431638.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:17.051
429	144	2	https://images.pexels.com/photos/27920699/pexels-photo-27920699.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:17.051
430	145	0	https://images.pexels.com/photos/2479646/pexels-photo-2479646.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:24.242
431	145	1	https://images.pexels.com/photos/12519335/pexels-photo-12519335.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:24.242
432	145	2	https://images.pexels.com/photos/29136157/pexels-photo-29136157.png?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:24.242
433	146	0	https://images.pexels.com/photos/20329603/pexels-photo-20329603.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:31.42
434	146	1	https://images.pexels.com/photos/4354665/pexels-photo-4354665.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:31.42
435	146	2	https://images.pexels.com/photos/27256466/pexels-photo-27256466.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:31.42
436	147	0	https://images.pexels.com/photos/18294743/pexels-photo-18294743.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:38.624
437	147	1	https://images.pexels.com/photos/13311973/pexels-photo-13311973.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:38.624
438	147	2	https://images.pexels.com/photos/7871166/pexels-photo-7871166.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:38.624
439	148	0	https://images.pexels.com/photos/185364/pexels-photo-185364.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:45.794
440	148	1	https://images.pexels.com/photos/179908/pexels-photo-179908.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:45.794
441	148	2	https://images.pexels.com/photos/11006624/pexels-photo-11006624.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:45.794
442	149	0	https://images.pexels.com/photos/3908800/pexels-photo-3908800.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:52.212
443	149	1	https://images.pexels.com/photos/8281768/pexels-photo-8281768.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:52.212
444	149	2	https://images.pexels.com/photos/27035625/pexels-photo-27035625.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:52.212
445	150	0	https://images.pexels.com/photos/9058879/pexels-photo-9058879.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:59.224
446	150	1	https://images.pexels.com/photos/31799256/pexels-photo-31799256.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:59.224
447	150	2	https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:34:59.224
448	151	0	https://images.pexels.com/photos/12893376/pexels-photo-12893376.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:06.327
449	151	1	https://images.pexels.com/photos/2130137/pexels-photo-2130137.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:06.327
450	151	2	https://images.pexels.com/photos/8374522/pexels-photo-8374522.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:06.327
451	152	0	https://images.pexels.com/photos/27782341/pexels-photo-27782341.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:13.315
452	152	1	https://images.pexels.com/photos/14208763/pexels-photo-14208763.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:13.315
453	152	2	https://images.pexels.com/photos/5161723/pexels-photo-5161723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:13.315
454	153	0	https://images.pexels.com/photos/28977814/pexels-photo-28977814.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:19.702
455	153	1	https://images.pexels.com/photos/28977814/pexels-photo-28977814.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:19.702
456	153	2	https://images.pexels.com/photos/28977814/pexels-photo-28977814.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:19.702
457	154	0	https://images.pexels.com/photos/7157039/pexels-photo-7157039.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:26.502
458	154	1	https://images.pexels.com/photos/16105475/pexels-photo-16105475.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:26.502
459	154	2	https://images.pexels.com/photos/7006161/pexels-photo-7006161.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:26.502
460	155	0	https://images.pexels.com/photos/14111400/pexels-photo-14111400.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:33.543
461	155	1	https://images.pexels.com/photos/26736141/pexels-photo-26736141.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:33.543
462	155	2	https://images.pexels.com/photos/12456258/pexels-photo-12456258.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:33.543
463	156	0	https://images.pexels.com/photos/28994711/pexels-photo-28994711.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:40.385
464	156	1	https://images.pexels.com/photos/27617194/pexels-photo-27617194.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:40.385
465	156	2	https://images.pexels.com/photos/26965826/pexels-photo-26965826.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:40.385
466	157	0	https://images.pexels.com/photos/2416871/pexels-photo-2416871.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:47.495
467	157	1	https://images.pexels.com/photos/9476335/pexels-photo-9476335.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:47.495
468	157	2	https://images.pexels.com/photos/6412114/pexels-photo-6412114.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:47.495
469	158	0	https://images.pexels.com/photos/1879096/pexels-photo-1879096.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:54.461
470	158	1	https://images.pexels.com/photos/18946664/pexels-photo-18946664.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:54.461
471	158	2	https://images.pexels.com/photos/3098619/pexels-photo-3098619.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:35:54.461
472	159	0	https://images.pexels.com/photos/11112731/pexels-photo-11112731.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:01.226
473	159	1	https://images.pexels.com/photos/2746823/pexels-photo-2746823.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:01.226
474	159	2	https://images.pexels.com/photos/3908800/pexels-photo-3908800.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:01.226
475	160	0	https://images.pexels.com/photos/7351211/pexels-photo-7351211.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:08.594
476	160	1	https://images.pexels.com/photos/26888868/pexels-photo-26888868.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:08.594
477	160	2	https://images.pexels.com/photos/7351211/pexels-photo-7351211.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:08.594
478	161	0	https://images.pexels.com/photos/5623083/pexels-photo-5623083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:15.017
479	161	1	https://images.pexels.com/photos/17488465/pexels-photo-17488465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:15.017
480	161	2	https://images.pexels.com/photos/5623083/pexels-photo-5623083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:15.017
481	162	0	https://images.pexels.com/photos/19820995/pexels-photo-19820995.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:21.768
482	162	1	https://images.pexels.com/photos/4841178/pexels-photo-4841178.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:21.768
483	162	2	https://images.pexels.com/photos/29502913/pexels-photo-29502913.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:21.768
484	163	0	https://images.pexels.com/photos/29193417/pexels-photo-29193417.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:28.845
485	163	1	https://images.pexels.com/photos/6716442/pexels-photo-6716442.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:28.845
486	163	2	https://images.pexels.com/photos/15684138/pexels-photo-15684138.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:28.845
487	164	0	https://images.pexels.com/photos/17411774/pexels-photo-17411774.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:35.488
488	164	1	https://images.pexels.com/photos/9817434/pexels-photo-9817434.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:35.488
489	164	2	https://images.pexels.com/photos/10269856/pexels-photo-10269856.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:35.488
490	165	0	https://images.pexels.com/photos/8634412/pexels-photo-8634412.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:42.676
491	165	1	https://images.pexels.com/photos/27471115/pexels-photo-27471115.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:42.676
492	165	2	https://images.pexels.com/photos/17264328/pexels-photo-17264328.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:42.676
493	166	0	https://images.pexels.com/photos/8743826/pexels-photo-8743826.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:50.545
494	166	1	https://images.pexels.com/photos/18698234/pexels-photo-18698234.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:50.545
495	166	2	https://images.pexels.com/photos/32178055/pexels-photo-32178055.png?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:50.545
496	167	0	https://images.pexels.com/photos/422292/pexels-photo-422292.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:56.999
497	167	1	https://images.pexels.com/photos/422292/pexels-photo-422292.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:56.999
498	167	2	https://images.pexels.com/photos/27243816/pexels-photo-27243816.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:36:56.999
499	168	0	https://images.pexels.com/photos/4061656/pexels-photo-4061656.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:04.167
500	168	1	https://images.pexels.com/photos/32177946/pexels-photo-32177946.png?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:04.167
501	168	2	https://images.pexels.com/photos/18746747/pexels-photo-18746747.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:04.167
502	169	0	https://images.pexels.com/photos/30706445/pexels-photo-30706445.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:11.831
503	169	1	https://images.pexels.com/photos/19577865/pexels-photo-19577865.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:11.831
504	169	2	https://images.pexels.com/photos/3098621/pexels-photo-3098621.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:11.831
505	170	0	https://images.pexels.com/photos/17881671/pexels-photo-17881671.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:19.03
506	170	1	https://images.pexels.com/photos/1088160/pexels-photo-1088160.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:19.03
507	170	2	https://images.pexels.com/photos/694587/pexels-photo-694587.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:19.03
508	171	0	https://images.pexels.com/photos/34310065/pexels-photo-34310065.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:25.801
509	171	1	https://images.pexels.com/photos/9817434/pexels-photo-9817434.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:25.801
510	171	2	https://images.pexels.com/photos/20249466/pexels-photo-20249466.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:25.801
511	172	0	https://images.pexels.com/photos/16569107/pexels-photo-16569107.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:32.521
512	172	1	https://images.pexels.com/photos/16216730/pexels-photo-16216730.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:32.521
513	172	2	https://images.pexels.com/photos/7157062/pexels-photo-7157062.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:32.521
514	173	0	https://images.pexels.com/photos/15986812/pexels-photo-15986812.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:39.644
515	173	1	https://images.pexels.com/photos/12496002/pexels-photo-12496002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:39.644
516	173	2	https://images.pexels.com/photos/34741671/pexels-photo-34741671.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:39.644
517	174	0	https://images.pexels.com/photos/2693200/pexels-photo-2693200.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:46.482
518	174	1	https://images.pexels.com/photos/25857376/pexels-photo-25857376.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:46.482
519	174	2	https://images.pexels.com/photos/14610774/pexels-photo-14610774.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:46.482
520	175	0	https://images.pexels.com/photos/4427221/pexels-photo-4427221.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:53.606
521	175	1	https://images.pexels.com/photos/17317671/pexels-photo-17317671.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:53.606
522	175	2	https://images.pexels.com/photos/17317671/pexels-photo-17317671.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:37:53.606
523	176	0	https://images.pexels.com/photos/6053102/pexels-photo-6053102.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:01.1
524	176	1	https://images.pexels.com/photos/194917/pexels-photo-194917.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:01.1
525	176	2	https://images.pexels.com/photos/13537946/pexels-photo-13537946.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:01.1
526	177	0	https://images.pexels.com/photos/12737663/pexels-photo-12737663.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:08.629
527	177	1	https://images.pexels.com/photos/909908/pexels-photo-909908.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:08.629
528	177	2	https://images.pexels.com/photos/2693448/pexels-photo-2693448.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:08.629
529	178	0	https://images.pexels.com/photos/4309155/pexels-photo-4309155.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:15.039
530	178	1	https://images.pexels.com/photos/30163490/pexels-photo-30163490.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:15.039
531	178	2	https://images.pexels.com/photos/30163490/pexels-photo-30163490.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:15.039
532	179	0	https://images.pexels.com/photos/15975917/pexels-photo-15975917.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:22.437
533	179	1	https://images.pexels.com/photos/2480395/pexels-photo-2480395.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:22.437
534	179	2	https://images.pexels.com/photos/2385657/pexels-photo-2385657.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:22.437
535	180	0	https://images.pexels.com/photos/3459967/pexels-photo-3459967.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:29.816
536	180	1	https://images.pexels.com/photos/11254903/pexels-photo-11254903.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:29.816
537	180	2	https://images.pexels.com/photos/33501956/pexels-photo-33501956.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:29.816
538	181	0	https://images.pexels.com/photos/9933631/pexels-photo-9933631.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:37.164
539	181	1	https://images.pexels.com/photos/7434285/pexels-photo-7434285.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:37.164
540	181	2	https://images.pexels.com/photos/12939229/pexels-photo-12939229.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:37.164
541	182	0	https://images.pexels.com/photos/11539579/pexels-photo-11539579.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:43.81
542	182	1	https://images.pexels.com/photos/12632015/pexels-photo-12632015.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:43.81
543	182	2	https://images.pexels.com/photos/30559963/pexels-photo-30559963.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:43.81
544	183	0	https://images.pexels.com/photos/17826906/pexels-photo-17826906.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:51.194
545	183	1	https://images.pexels.com/photos/700558/pexels-photo-700558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:51.194
546	183	2	https://images.pexels.com/photos/13452647/pexels-photo-13452647.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:51.194
547	184	0	https://images.pexels.com/photos/9201194/pexels-photo-9201194.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:58.584
548	184	1	https://images.pexels.com/photos/11292452/pexels-photo-11292452.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:58.584
549	184	2	https://images.pexels.com/photos/5720724/pexels-photo-5720724.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:38:58.584
550	185	0	https://images.pexels.com/photos/13969210/pexels-photo-13969210.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:05.92
551	185	1	https://images.pexels.com/photos/9201194/pexels-photo-9201194.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:05.92
552	185	2	https://images.pexels.com/photos/13968345/pexels-photo-13968345.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:05.92
553	186	0	https://images.pexels.com/photos/34237321/pexels-photo-34237321.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:13.125
554	186	1	https://images.pexels.com/photos/26571258/pexels-photo-26571258.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:13.125
555	186	2	https://images.pexels.com/photos/20847544/pexels-photo-20847544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:13.125
556	187	0	https://images.pexels.com/photos/6774657/pexels-photo-6774657.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:19.809
557	187	1	https://images.pexels.com/photos/18285688/pexels-photo-18285688.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:19.809
558	187	2	https://images.pexels.com/photos/19766306/pexels-photo-19766306.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:19.809
559	188	0	https://images.pexels.com/photos/35529251/pexels-photo-35529251.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:26.814
560	188	1	https://images.pexels.com/photos/26117145/pexels-photo-26117145.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:26.814
561	188	2	https://images.pexels.com/photos/3756655/pexels-photo-3756655.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:26.814
562	189	0	https://images.pexels.com/photos/16927366/pexels-photo-16927366.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:33.57
563	189	1	https://images.pexels.com/photos/33525723/pexels-photo-33525723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:33.57
564	189	2	https://images.pexels.com/photos/18066458/pexels-photo-18066458.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:33.57
565	190	0	https://images.pexels.com/photos/4841460/pexels-photo-4841460.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:40.978
566	190	1	https://images.pexels.com/photos/1776331/pexels-photo-1776331.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:40.978
567	190	2	https://images.pexels.com/photos/4841250/pexels-photo-4841250.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:40.978
568	191	0	https://images.pexels.com/photos/18815198/pexels-photo-18815198.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:48.019
569	191	1	https://images.pexels.com/photos/20818882/pexels-photo-20818882.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:48.019
570	191	2	https://images.pexels.com/photos/28406043/pexels-photo-28406043.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:48.019
571	192	0	https://images.pexels.com/photos/11285468/pexels-photo-11285468.png?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:54.868
572	192	1	https://images.pexels.com/photos/19874080/pexels-photo-19874080.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:54.868
573	192	2	https://images.pexels.com/photos/29682323/pexels-photo-29682323.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:39:54.868
574	193	0	https://images.pexels.com/photos/32421762/pexels-photo-32421762.png?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:40:01.315
575	193	1	https://images.pexels.com/photos/32421762/pexels-photo-32421762.png?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:40:01.315
576	193	2	https://images.pexels.com/photos/32421762/pexels-photo-32421762.png?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:40:01.315
577	194	0	https://images.pexels.com/photos/16466770/pexels-photo-16466770.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:40:07.915
578	194	1	https://images.pexels.com/photos/7045173/pexels-photo-7045173.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:40:07.915
579	194	2	https://images.pexels.com/photos/1983035/pexels-photo-1983035.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:40:07.915
580	195	0	https://images.pexels.com/photos/11512980/pexels-photo-11512980.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:40:14.624
581	195	1	https://images.pexels.com/photos/11512980/pexels-photo-11512980.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:40:14.624
582	195	2	https://images.pexels.com/photos/11512980/pexels-photo-11512980.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:40:14.624
583	196	0	https://images.pexels.com/photos/1346381/pexels-photo-1346381.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:40:22.017
584	196	1	https://images.pexels.com/photos/5556176/pexels-photo-5556176.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:40:22.017
585	196	2	https://images.pexels.com/photos/2629173/pexels-photo-2629173.jpeg?auto=compress&cs=tinysrgb&h=650&w=940	2026-01-09 07:40:22.017
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, "userId", "productId", rating, comment, "createdAt", "updatedAt", helpful, title) FROM stdin;
1	19	145	3	Erfüllt seinen Zweck, aber nichts Besonderes. Preis-Leistung ist okay.	2026-01-09 07:34:24.278	2026-01-09 07:34:24.278	19	Geht so
2	19	148	5	ASUS Tastatur erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:34:45.811	2026-01-09 07:34:45.811	19	Sehr zufrieden!
3	19	149	5	MSI Maus erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:34:52.229	2026-01-09 07:34:52.229	1	Sehr zufrieden!
4	18	149	5	MSI Maus erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:34:52.235	2026-01-09 07:34:52.235	18	Sehr zufrieden!
5	19	152	5	LG Drucker erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:35:13.351	2026-01-09 07:35:13.351	8	Sehr zufrieden!
6	18	154	5	H&M T-Shirt erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:35:26.53	2026-01-09 07:35:26.53	3	Sehr zufrieden!
7	18	156	5	Bin sehr happy mit dem Jeans. Von Tommy Hilfiger wie gewohnt hohe Qualität!	2026-01-09 07:35:40.415	2026-01-09 07:35:40.415	6	Top Produkt
8	19	158	5	Trage die Schuhe jetzt seit 2 Wochen täglich. Null Druckstellen, super Passform. Top!	2026-01-09 07:35:54.489	2026-01-09 07:35:54.489	15	Mega bequem!
9	18	158	5	Sehen richtig gut aus und sind dabei noch bequem. Was will man mehr?	2026-01-09 07:35:54.496	2026-01-09 07:35:54.496	15	Stylish und komfortabel
10	19	159	5	Nike Stiefel erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:36:01.261	2026-01-09 07:36:01.261	14	Sehr zufrieden!
11	18	159	5	Nike Stiefel erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:36:01.271	2026-01-09 07:36:01.271	21	Sehr zufrieden!
12	19	161	5	Nike Rucksack erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:36:15.07	2026-01-09 07:36:15.07	1	Sehr zufrieden!
13	18	161	4	Gutes Produkt zu fairem Preis. Kleine Abstriche in der Verpackung, aber sonst top.	2026-01-09 07:36:15.078	2026-01-09 07:36:15.078	22	Empfehlenswert
14	18	163	3	Erfüllt seinen Zweck, aber nichts Besonderes. Preis-Leistung ist okay.	2026-01-09 07:36:28.876	2026-01-09 07:36:28.876	19	Geht so
15	19	163	5	WMF Wasserkocher erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:36:28.884	2026-01-09 07:36:28.884	6	Sehr zufrieden!
16	19	164	4	Gutes Produkt zu fairem Preis. Kleine Abstriche in der Verpackung, aber sonst top.	2026-01-09 07:36:35.501	2026-01-09 07:36:35.501	17	Empfehlenswert
17	19	165	5	IKEA Sofa erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:36:42.713	2026-01-09 07:36:42.713	14	Sehr zufrieden!
18	19	166	5	Bin sehr happy mit dem Tisch. Von IKEA wie gewohnt hohe Qualität!	2026-01-09 07:36:50.578	2026-01-09 07:36:50.578	10	Top Produkt
19	18	166	4	Gutes Produkt zu fairem Preis. Kleine Abstriche in der Verpackung, aber sonst top.	2026-01-09 07:36:50.585	2026-01-09 07:36:50.585	19	Empfehlenswert
20	19	169	5	Bin sehr happy mit dem Laufschuhe. Von Reebok wie gewohnt hohe Qualität!	2026-01-09 07:37:11.858	2026-01-09 07:37:11.858	3	Top Produkt
21	18	170	5	Bin sehr happy mit dem Yogamatte. Von Decathlon wie gewohnt hohe Qualität!	2026-01-09 07:37:19.095	2026-01-09 07:37:19.095	2	Top Produkt
22	19	172	5	Bin sehr happy mit dem Basketball. Von Wilson wie gewohnt hohe Qualität!	2026-01-09 07:37:32.549	2026-01-09 07:37:32.549	0	Top Produkt
23	19	173	5	Bin sehr happy mit dem Fußball. Von Puma wie gewohnt hohe Qualität!	2026-01-09 07:37:39.678	2026-01-09 07:37:39.678	8	Top Produkt
24	18	173	5	Puma Fußball erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:37:39.687	2026-01-09 07:37:39.687	17	Sehr zufrieden!
25	18	174	5	Bin sehr happy mit dem Fahrrad. Von Decathlon wie gewohnt hohe Qualität!	2026-01-09 07:37:46.511	2026-01-09 07:37:46.511	23	Top Produkt
26	19	176	5	Bin sehr happy mit dem Krimi. Von Suhrkamp wie gewohnt hohe Qualität!	2026-01-09 07:38:01.125	2026-01-09 07:38:01.125	23	Top Produkt
27	18	177	4	Gutes Produkt zu fairem Preis. Kleine Abstriche in der Verpackung, aber sonst top.	2026-01-09 07:38:08.647	2026-01-09 07:38:08.647	20	Empfehlenswert
28	18	179	5	Ravensburger Brettspiel erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:38:22.47	2026-01-09 07:38:22.47	21	Sehr zufrieden!
29	18	183	5	Bin sehr happy mit dem Gartenschere. Von Wolf-Garten wie gewohnt hohe Qualität!	2026-01-09 07:38:51.227	2026-01-09 07:38:51.227	3	Top Produkt
30	19	183	4	Gutes Produkt zu fairem Preis. Kleine Abstriche in der Verpackung, aber sonst top.	2026-01-09 07:38:51.236	2026-01-09 07:38:51.236	23	Empfehlenswert
31	18	184	5	Gardena Blumentopf erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:38:58.607	2026-01-09 07:38:58.607	23	Sehr zufrieden!
32	19	184	5	Gardena Blumentopf erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:38:58.613	2026-01-09 07:38:58.613	23	Sehr zufrieden!
33	18	185	5	Gardena Gartenmöbel erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:39:05.96	2026-01-09 07:39:05.96	12	Sehr zufrieden!
34	18	186	5	Bin sehr happy mit dem Motoröl. Von Shell wie gewohnt hohe Qualität!	2026-01-09 07:39:13.159	2026-01-09 07:39:13.159	4	Top Produkt
35	19	187	5	3M Werkzeugset erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:39:19.848	2026-01-09 07:39:19.848	21	Sehr zufrieden!
36	18	188	5	Bosch Dashcam erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:39:26.848	2026-01-09 07:39:26.848	4	Sehr zufrieden!
37	19	188	5	Bin sehr happy mit dem Dashcam. Von Bosch wie gewohnt hohe Qualität!	2026-01-09 07:39:26.858	2026-01-09 07:39:26.858	11	Top Produkt
38	19	190	5	Bin sehr happy mit dem Gesichtscreme. Von L'Oréal wie gewohnt hohe Qualität!	2026-01-09 07:39:41.012	2026-01-09 07:39:41.012	17	Top Produkt
39	18	190	4	Gutes Produkt zu fairem Preis. Kleine Abstriche in der Verpackung, aber sonst top.	2026-01-09 07:39:41.022	2026-01-09 07:39:41.022	0	Empfehlenswert
40	18	192	4	Gutes Produkt zu fairem Preis. Kleine Abstriche in der Verpackung, aber sonst top.	2026-01-09 07:39:54.901	2026-01-09 07:39:54.901	23	Empfehlenswert
41	18	193	5	Bin sehr happy mit dem Kaffee. Von Edeka wie gewohnt hohe Qualität!	2026-01-09 07:40:01.339	2026-01-09 07:40:01.339	2	Top Produkt
42	19	194	5	Nestlé Tee erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!	2026-01-09 07:40:07.949	2026-01-09 07:40:07.949	3	Sehr zufrieden!
43	18	194	5	Bin sehr happy mit dem Tee. Von Nestlé wie gewohnt hohe Qualität!	2026-01-09 07:40:07.958	2026-01-09 07:40:07.958	22	Top Produkt
44	19	195	5	Qualität ist spitze, schmilzt auf der Zunge. Perfekt zum Verschenken oder selbst genießen!	2026-01-09 07:40:14.663	2026-01-09 07:40:14.663	11	Beste Schokolade!
\.


--
-- Data for Name: SupportChat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SupportChat" (id, "userId", status, subject, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name, password, "createdAt", "updatedAt", "isAdmin", "defaultAddressId", "defaultPayment", "defaultSupplier") FROM stdin;
17	admin@hanspeter.shop	Admin Hans Peter	$2b$10$i4quXmXsK6WrFP9e.nNI0.tXlJ76l0o6wsyCQ62cwhuFeoHm2xkc6	2026-01-09 07:34:06.356	2026-01-09 07:34:06.356	t	\N	\N	\N
18	max@example.com	Max Mustermann	$2b$10$YKOxXjr3aWuBg8txQYZVUuLslaKDV9jJFt3QM.pdPgzi21hPeSQwG	2026-01-09 07:34:06.799	2026-01-09 07:34:06.799	f	\N	\N	\N
19	erika@example.com	Erika Musterfrau	$2b$10$YKOxXjr3aWuBg8txQYZVUuLslaKDV9jJFt3QM.pdPgzi21hPeSQwG	2026-01-09 07:34:06.824	2026-01-09 07:34:06.824	f	\N	\N	\N
\.


--
-- Data for Name: Wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Wishlist" (id, "userId", name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: WishlistItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WishlistItem" (id, "wishlistId", "productId", "createdAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
b816e0e5-3c25-4315-bd49-c0fd4fac3342	5c0d2b2c7e94d00eae0539a287bdc01f8bbda50794d06c7530fe16a8f73b589b	2025-12-11 09:53:10.812106+00	20251121090431_init	\N	\N	2025-12-11 09:53:10.195221+00	1
120a9337-f9bd-4d5b-a1f3-f042ea2c1c53	0ccacada580eeaa1eb4682795c2a01002c1d0ff2c318aadf8ab962e4a350068e	2025-12-11 09:53:11.07435+00	20251128085600_add_category_brand	\N	\N	2025-12-11 09:53:10.814795+00	1
b3aacb64-7ca5-4b5e-884f-048880350b0c	a60a6e1f3999b1f6249172d62a697bb0d9e3978b868c49f86553843d5db30cc0	2025-12-11 09:53:11.162032+00	20251128092400_category_many_to_many	\N	\N	2025-12-11 09:53:11.076349+00	1
f376a58a-e4d9-4aea-9837-df773065ae2b	464647fa71ef8790d54abb72c640bc10f1dc62c4e06b7dd2a895b55173c54d5f	2025-12-11 09:53:11.231135+00	20251128095626_add_product_details	\N	\N	2025-12-11 09:53:11.164154+00	1
8925d5b0-0219-442b-93b0-4fa2100dadca	3e2a2087fd0299e5e299a5033977f4d0984c3e4b4f16cf7d967ebbf258c3203a	2025-12-11 09:53:34.464299+00	20251211095334_add_admin_sessions	\N	\N	2025-12-11 09:53:34.34739+00	1
\.


--
-- Name: Address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Address_id_seq"', 1, true);


--
-- Name: Brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Brand_id_seq"', 233, true);


--
-- Name: CartItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CartItem_id_seq"', 2, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 61, true);


--
-- Name: ChatMessage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChatMessage_id_seq"', 1, false);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 1, false);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_id_seq"', 1, false);


--
-- Name: ProductDetail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProductDetail_id_seq"', 943, true);


--
-- Name: ProductImage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProductImage_id_seq"', 585, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_id_seq"', 196, true);


--
-- Name: Review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Review_id_seq"', 44, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 19, true);


--
-- Name: WishlistItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."WishlistItem_id_seq"', 2, true);


--
-- Name: Wishlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Wishlist_id_seq"', 2, true);


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: AdminSession AdminSession_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AdminSession"
    ADD CONSTRAINT "AdminSession_pkey" PRIMARY KEY (id);


--
-- Name: Brand Brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_pkey" PRIMARY KEY (id);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: ChatMessage ChatMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: ProductCategory ProductCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductCategory"
    ADD CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("productId", "categoryId");


--
-- Name: ProductDetail ProductDetail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductDetail"
    ADD CONSTRAINT "ProductDetail_pkey" PRIMARY KEY (id);


--
-- Name: ProductImage ProductImage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: SupportChat SupportChat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupportChat"
    ADD CONSTRAINT "SupportChat_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: WishlistItem WishlistItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_pkey" PRIMARY KEY (id);


--
-- Name: Wishlist Wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wishlist"
    ADD CONSTRAINT "Wishlist_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Address_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Address_userId_idx" ON public."Address" USING btree ("userId");


--
-- Name: AdminSession_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AdminSession_token_idx" ON public."AdminSession" USING btree (token);


--
-- Name: AdminSession_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AdminSession_token_key" ON public."AdminSession" USING btree (token);


--
-- Name: AdminSession_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AdminSession_userId_idx" ON public."AdminSession" USING btree ("userId");


--
-- Name: Brand_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Brand_name_key" ON public."Brand" USING btree (name);


--
-- Name: CartItem_userId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CartItem_userId_productId_key" ON public."CartItem" USING btree ("userId", "productId");


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: ChatMessage_chatId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatMessage_chatId_idx" ON public."ChatMessage" USING btree ("chatId");


--
-- Name: ChatMessage_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatMessage_userId_idx" ON public."ChatMessage" USING btree ("userId");


--
-- Name: OrderItem_orderId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "OrderItem_orderId_productId_key" ON public."OrderItem" USING btree ("orderId", "productId");


--
-- Name: ProductCategory_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProductCategory_categoryId_idx" ON public."ProductCategory" USING btree ("categoryId");


--
-- Name: ProductDetail_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProductDetail_productId_idx" ON public."ProductDetail" USING btree ("productId");


--
-- Name: ProductImage_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProductImage_productId_idx" ON public."ProductImage" USING btree ("productId");


--
-- Name: ProductImage_productId_index_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProductImage_productId_index_key" ON public."ProductImage" USING btree ("productId", index);


--
-- Name: Product_brandId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_brandId_idx" ON public."Product" USING btree ("brandId");


--
-- Name: Product_name_brandId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_name_brandId_key" ON public."Product" USING btree (name, "brandId");


--
-- Name: Review_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Review_productId_idx" ON public."Review" USING btree ("productId");


--
-- Name: Review_rating_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Review_rating_idx" ON public."Review" USING btree (rating);


--
-- Name: Review_userId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Review_userId_productId_key" ON public."Review" USING btree ("userId", "productId");


--
-- Name: SupportChat_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SupportChat_status_idx" ON public."SupportChat" USING btree (status);


--
-- Name: SupportChat_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SupportChat_userId_idx" ON public."SupportChat" USING btree ("userId");


--
-- Name: User_defaultAddressId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_defaultAddressId_key" ON public."User" USING btree ("defaultAddressId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: WishlistItem_wishlistId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WishlistItem_wishlistId_productId_key" ON public."WishlistItem" USING btree ("wishlistId", "productId");


--
-- Name: Address Address_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AdminSession AdminSession_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AdminSession"
    ADD CONSTRAINT "AdminSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatMessage ChatMessage_chatId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES public."SupportChat"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatMessage ChatMessage_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductCategory ProductCategory_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductCategory"
    ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductCategory ProductCategory_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductCategory"
    ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductDetail ProductDetail_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductDetail"
    ADD CONSTRAINT "ProductDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductImage ProductImage_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Product Product_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SupportChat SupportChat_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupportChat"
    ADD CONSTRAINT "SupportChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_defaultAddressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_defaultAddressId_fkey" FOREIGN KEY ("defaultAddressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WishlistItem WishlistItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WishlistItem WishlistItem_wishlistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES public."Wishlist"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Wishlist Wishlist_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wishlist"
    ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict YnwqbVijHvHZ3c9wxKMB9JaVAppfV1rujIVbN3ZeIszb8TikEsvFBVtQHtmdiR4

