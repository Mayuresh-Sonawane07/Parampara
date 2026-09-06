from datetime import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app import models, auth
from app.config import settings

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        print('Checking if database is already seeded...')
        if db.query(models.Tradition).count() > 0:
            print('Database already contains traditions. Skipping duplicate seeding.')
            return

        print('Seeding verified research sources...')
        s1 = models.Source(
            title='Traditional brass and copper craft of utensil making among the Thatheras of Jandiala Guru, Punjab, India (File 00845)',
            organization='UNESCO',
            author='Intergovernmental Committee for the Safeguarding of the Intangible Cultural Heritage',
            source_type='UNESCO',
            url='https://ich.unesco.org/en/RL/traditional-brass-and-copper-craft-of-utensil-making-among-the-thatheras-of-jandiala-guru-punjab-india-00845',
            description='Official inscription on the Representative List of the Intangible Cultural Heritage of Humanity (9.COM, 2014).',
            verification_status='VERIFIED'
        )
        s2 = models.Source(
            title='National List of Intangible Cultural Heritage: Craftsmanship of Thatheras',
            organization='Ministry of Culture, Government of India & Sangeet Natak Akademi',
            author='Sangeet Natak Akademi',
            source_type='GOVERNMENT',
            url='https://indiaculture.gov.in/intangible-cultural-heritage',
            description='Official repository documentation for traditional craftsmanship in metalsmithing in Jandiala Guru, Punjab.',
            verification_status='VERIFIED'
        )
        s3 = models.Source(
            title='Geographical Indications Registry: Toda Embroidery (GI Application No. 135)',
            organization='Geographical Indications Registry, Government of India',
            author='Office of the Controller General of Patents, Designs & Trade Marks',
            source_type='GOVERNMENT',
            url='https://ipindia.gov.in',
            description='Geographical Indication registration Certificate No. 187, registered in 2013 for Toda Embroidery in Tamil Nadu.',
            verification_status='VERIFIED'
        )
        s4 = models.Source(
            title='Toda Embroidery of the Nilgiris: Craft Documentation',
            organization='Development Commissioner (Handicrafts), Ministry of Textiles, Government of India',
            author='Development Commissioner (Handicrafts)',
            source_type='GOVERNMENT',
            url='http://handicrafts.nic.in',
            description='Documentation of traditional counted-thread embroidery techniques and motifs of the Toda community.',
            verification_status='VERIFIED'
        )
        s5 = models.Source(
            title='Chhau dance (Nomination File No. 00337)',
            organization='UNESCO',
            author='Intergovernmental Committee for the Safeguarding of the Intangible Cultural Heritage',
            source_type='UNESCO',
            url='https://ich.unesco.org/en/RL/chhau-dance-00337',
            description='Official inscription on the Representative List of the Intangible Cultural Heritage of Humanity (5.COM, 2010).',
            verification_status='VERIFIED'
        )
        s6 = models.Source(
            title='Chhau Dance Forms of Eastern India: Seraikella, Purulia, and Mayurbhanj',
            organization='Sangeet Natak Akademi, Government of India',
            author='Sangeet Natak Akademi',
            source_type='GOVERNMENT',
            url='https://sangeetnatak.gov.in',
            description='Comprehensive institutional documentation on regional variations, masks, music, and martial footwork of Chhau.',
            verification_status='VERIFIED'
        )
        s7 = models.Source(
            title='Cultural Mapping of the Warli Community (Palghar District, Maharashtra)',
            organization='Indian National Trust for Art and Cultural Heritage (INTACH)',
            author='INTACH Dahanu Chapter (Phiroza Tafti & Pallavi Ganju)',
            source_type='INTACH',
            url='http://intach.org',
            description='Field research documenting intangible cultural heritage, sacred iconography, music, and folklore of the Warli community (2015).',
            verification_status='VERIFIED'
        )
        s8 = models.Source(
            title='Geographical Indications Registry: Warli Painting (GI Application No. 342)',
            organization='Geographical Indications Registry, Government of India',
            author='Office of the Controller General of Patents, Designs & Trade Marks',
            source_type='GOVERNMENT',
            url='https://ipindia.gov.in',
            description='GI Registration Certificate No. 211, registered March 31, 2014, protecting traditional Warli tribal paintings.',
            verification_status='VERIFIED'
        )

        db.add_all([s1, s2, s3, s4, s5, s6, s7, s8])
        db.commit()

        print('Seeding Thathera Metal Craft...')
        t_thathera = models.Tradition(
            name='Thathera Metal Craft',
            slug='thathera',
            region='North',
            state='Punjab',
            community='Thathera Artisan Community',
            category='Metal Craft',
            short_description='The traditional technique of manufacturing brass and copper utensils among the Thatheras of Jandiala Guru, Punjab.',
            description='The craft of the Thatheras of Jandiala Guru represents an unbroken tradition of manufacturing hand-beaten brass, copper, and kansa (bronze) utensils. Settled during the reign of Maharaja Ranjit Singh in the 19th century, the artisan community utilizes specialized hot-hammering and cold-hammering techniques to fashion durable culinary and ritual vessels.',
            historical_context='Historical records and oral accounts document that Maharaja Ranjit Singh encouraged skilled metal artisans from Kashmir and Rajasthan to establish workshops in Jandiala Guru. The town grew into a vibrant regional centre for metalsmithing.',
            cultural_significance='Thathera utensils are integral to Punjabi social life, domestic hospitality, and ceremonial gifting. According to Ayurveda, cooking and storing in copper and brass vessels imparts positive health properties.',
            preservation_context='Traditional knowledge transmission faces challenges from mass-produced stainless steel and aluminium cookware. Safeguarding initiatives involve contemporary design interventions and documentation.',
            experience_type='CRAFT_JOURNEY',
            hero_image='/heritage-images/thathera.jpg',
            thumbnail='/heritage-images/thathera.jpg',
            status='PUBLISHED'
        )
        t_thathera.sources.extend([s1, s2])
        db.add(t_thathera)
        db.commit()

        exp_thathera = models.Experience(
            tradition_id=t_thathera.id,
            type='CRAFT_JOURNEY',
            title='Thathera Craft Journey: From Ingot to Luminous Vessel',
            description='Follow the eight traditional stages of hand-hammered utensil fabrication documented in Jandiala Guru.'
        )
        db.add(exp_thathera)
        db.commit()

        thathera_steps = [
            ('Raw Ingot Selection', 'Copper and zinc scrap or pre-melted ingots (goli/katta) are weighed according to traditional proportion recipes for brass (pittal) or kansa (bronze).', 'Purity of metal is verified by color and density before firing.', 'Charcoal furnace (Bhatti), Raw metal ingots', s1.id),
            ('Ingot Heating in Pit Furnace', 'Ingots are placed into a subterranean charcoal pit furnace heated by hand-operated or electric bellows until red hot.', 'Thermal cycles require exact observation of glowing color without pyrometers.', 'Subterranean Bhatti, Bellows (Dhokhni)', s1.id),
            ('Sledgehammer Flattening', 'Multiple artisans work in coordinated rhythm using heavy sledgehammers to flatten red-hot ingots into circular metal plates.', 'Team hammering requires precise auditory rhythm and coordinated swings.', 'Heavy sledgehammers (Hathoda), Anvil (Nihai)', s2.id),
            ('Bowl & Rim Sinking', 'The flattened metal sheet is annealed and beaten into shallow depressions carved in stone or wood blocks to form bowl walls.', 'Curvature is produced entirely by progressive hand blows from rim to base.', 'Depression anvil, Ball-peen wooden mallets', s1.id),
            ('Brazing & Assembly (Tanka)', 'Segments of complex vessels (such as the base and neck of a gaggar pitcher) are joined using brass solder and borax flux, then reheated.', 'Tanka joints are hammer-planished until the seam becomes nearly invisible.', 'Brass alloy solder, Borax flux, Pincers (Chimta)', s1.id),
            ('Acid Bath & Tamarind Cleaning', 'Vessels are immersed in dilute acid to strip fire-scale, then vigorously scrubbed with tamarind (imli) pulp and fine river sand.', 'Natural tartaric acid in tamarind dissolves copper oxides without pitting the surface.', 'Tamarind pulp, River sand, Rags, Water basins', s1.id),
            ('Surface Chasing & Dimpling (Kandhai)', 'The artisan sits cross-legged, supporting the vessel on a stake anvil, and systematically strikes the exterior with a small polished hammer to form dense, shimmering indentations.', 'Dimpling is not purely decorative; it work-hardens the annealed metal, reinforcing structural rigidity.', 'Polished steel ball hammer, Stake anvil (Kund)', s1.id),
            ('Kalai (Interior Tinning)', 'For vessels destined for acidic cooking or milk storage, the interior is heated and coated with molten tin using sal ammoniac flux.', 'Kalai prevents chemical reactions between acidic food ingredients and copper alloys.', 'Pure tin (Ranga), Sal ammoniac (Naushadar), Cotton swab', s2.id)
        ]

        for i, (title, desc, context, tools, src_id) in enumerate(thathera_steps, 1):
            db.add(models.ExperienceItem(
                experience_id=exp_thathera.id,
                title=title,
                order_index=i,
                category_or_style=f'Stage {i}',
                description=desc,
                cultural_context=context,
                regional_perspective='Practiced along the historic Gali Thatherian alleyways of Jandiala Guru.',
                tool_or_material=tools,
                source_id=src_id
            ))
        db.commit()

        q_thathera = models.Quiz(
            tradition_id=t_thathera.id,
            title='Thathera Metal Craft Quiz',
            description='Test your understanding of the traditional UNESCO-inscribed brass and copper utensil-making craft.'
        )
        db.add(q_thathera)
        db.commit()

        qq1 = models.QuizQuestion(
            quiz_id=q_thathera.id,
            question_text='In which historic town of Punjab is the UNESCO-inscribed Thathera metal utensil craft concentrated?',
            order_index=1,
            explanation='Jandiala Guru in Amritsar district, Punjab, is the historic centre where Maharaja Ranjit Singh encouraged Thathera metalsmiths to settle.',
            source_id=s1.id
        )
        db.add(qq1)
        db.commit()
        db.add_all([
            models.QuizOption(question_id=qq1.id, option_text='Jandiala Guru', is_correct=True, order_index=1),
            models.QuizOption(question_id=qq1.id, option_text='Anandpur Sahib', is_correct=False, order_index=2),
            models.QuizOption(question_id=qq1.id, option_text='Sultanpur Lodhi', is_correct=False, order_index=3),
            models.QuizOption(question_id=qq1.id, option_text='Nakodar', is_correct=False, order_index=4),
        ])

        qq2 = models.QuizQuestion(
            quiz_id=q_thathera.id,
            question_text='What natural ingredient is traditionally utilized by Thatheras alongside sand to polish and scour metal vessels?',
            order_index=2,
            explanation='Thatheras scour newly forged vessels with tamarind (imli) juice and fine sand to remove oxidation without harming the surface.',
            source_id=s1.id
        )
        db.add(qq2)
        db.commit()
        db.add_all([
            models.QuizOption(question_id=qq2.id, option_text='Tamarind juice and sand', is_correct=True, order_index=1),
            models.QuizOption(question_id=qq2.id, option_text='Lemon peel and chalk', is_correct=False, order_index=2),
            models.QuizOption(question_id=qq2.id, option_text='Mustard oil and clay', is_correct=False, order_index=3),
            models.QuizOption(question_id=qq2.id, option_text='Turmeric and wood ash', is_correct=False, order_index=4),
        ])

        qq3 = models.QuizQuestion(
            quiz_id=q_thathera.id,
            question_text='Beyond its shimmering visual pattern, what functional benefit does the dimpling technique (kandhai) provide?',
            order_index=3,
            explanation='The small hammered indentations work-harden the annealed metal, structurally reinforcing the utensil walls.',
            source_id=s2.id
        )
        db.add(qq3)
        db.commit()
        db.add_all([
            models.QuizOption(question_id=qq3.id, option_text='It work-hardens and structurally strengthens the vessel walls', is_correct=True, order_index=1),
            models.QuizOption(question_id=qq3.id, option_text='It makes the vessel lighter to carry', is_correct=False, order_index=2),
            models.QuizOption(question_id=qq3.id, option_text='It allows the vessel to heat water without a flame', is_correct=False, order_index=3),
            models.QuizOption(question_id=qq3.id, option_text='It prevents the metal from melting', is_correct=False, order_index=4),
        ])
        db.commit()

        print('Seeding Toda Embroidery...')
        t_toda = models.Tradition(
            name='Toda Embroidery (Pukhoor)',
            slug='toda',
            region='South',
            state='Tamil Nadu',
            community='Toda Indigenous Pastoral Tribe',
            category='Textile / Embroidery',
            short_description='Reversible geometric counted-thread embroidery handcrafted by Toda women in the Nilgiri Hills.',
            description='Toda embroidery, known as \'Pukhoor\' in the Toda language, is a distinctive counted-thread craft practiced exclusively by the women of the Toda community in the Nilgiri Hills of Tamil Nadu. Characterized by striking red and black geometric motifs executed on unbleached coarse white cotton cloth, the craft holds protected Geographical Indication status.',
            historical_context='The Toda people are pastoralists whose life, sacred dairy institutions, and customs are centered in the high Nilgiri plateau. The embroidered mantle, called \'Poothkulli\', is an indispensable ceremonial garment worn during weddings, funerals, and seasonal rites.',
            cultural_significance='Poothkulli shawls serve as a primary visual marker of Toda cultural identity. The reverse-side darning stitch is executed so meticulously that the finished pattern looks embossed and woven directly into the fabric.',
            preservation_context='Protected under Geographical Indication No. 135. Artisan cooperatives and cultural societies actively support transmission and direct artisan marketing.',
            experience_type='MOTIF_EXPLORER',
            hero_image='/heritage-images/toda.jpg',
            thumbnail='/heritage-images/toda.jpg',
            status='PUBLISHED'
        )
        t_toda.sources.extend([s3, s4])
        db.add(t_toda)
        db.commit()

        exp_toda = models.Experience(
            tradition_id=t_toda.id,
            type='MOTIF_EXPLORER',
            title='Toda Motif Explorer: Sacred Geometry of the Nilgiris',
            description='Explore the documented geometric motifs and counted-thread techniques of the Toda Poothkulli.'
        )
        db.add(exp_toda)
        db.commit()

        toda_items = [
            ('Pukhoor (Floral Motif)', 'Stylized floral motifs reflecting the native wild blooms of the high-altitude Nilgiri shola grasslands.', 'Toda reverence for mountain shola ecology is embedded in textile patterns.', 'Counted warp/weft darning', s3.id),
            ('Modi (Buffalo Horn / Rose Motif)', 'Curving angular design representing both the sacred Nilgiri water buffalo horns and the wild briar rose.', 'The water buffalo is sacred to Toda religious life; motifs celebrate this pastoral bond.', 'Thick red/black wool yarn', s3.id),
            ('Karthal (Enclosed Kraal / Architectural Grid)', 'Geometric rectangular and square box patterns reflecting the traditional Toda barrel-vaulted huts (dogles) and sacred dairy enclosures.', 'Architectural proportions of sacred dairies translated into textile symmetry.', 'Counted-thread stitching', s4.id),
            ('Enepukhoor (Eight-Pointed Star)', 'Symmetrical stellar design symbolizing the morning star and directional guidance in the Nilgiri hills.', 'Used on ceremonial borders of the Poothkulli cloak.', 'Double-darning reverse stitch', s3.id),
            ('Step 1: Fabric Selection & Edge Preparation', 'Loosely woven unbleached white cotton cloth is measured, washed, and edges hand-hemmed without synthetic linings.', 'Natural ecru fabric provides high visual contrast with red and black wool.', 'Unbleached handloom cotton', s4.id),
            ('Step 2: Counting Warp and Weft', 'The artisan counts exact warp and weft threads using a fine needle without drawing or stenciling any guide marks.', 'Requires immense mental calculation and spatial memory passed matrilineally.', 'Steel embroidery needle', s3.id),
            ('Step 3: Reverse-Side Darning', 'Stitches are worked entirely from the reverse side of the cloth, pulling wool to create an embossed, woven relief on the front.', 'Produces a reversible textile that resembles a tapestry woven on a loom.', 'Red & black woollen yarn', s4.id)
        ]

        for i, (title, desc, context, tools, src_id) in enumerate(toda_items, 1):
            db.add(models.ExperienceItem(
                experience_id=exp_toda.id,
                title=title,
                order_index=i,
                category_or_style='Motif' if i <= 4 else 'Technique',
                description=desc,
                cultural_context=context,
                regional_perspective='Curated from Nilgiri pastoral settlements (munds) near Ooty, Tamil Nadu.',
                tool_or_material=tools,
                source_id=src_id
            ))
        db.commit()

        q_toda = models.Quiz(
            tradition_id=t_toda.id,
            title='Toda Embroidery Quiz',
            description='Test your knowledge of the Nilgiri Toda Pukhoor embroidery tradition.'
        )
        db.add(q_toda)
        db.commit()

        tq1 = models.QuizQuestion(
            quiz_id=q_toda.id,
            question_text='What is the traditional name for the embroidered mantle or cloak worn by the Toda community?',
            order_index=1,
            explanation='The embroidered cloak is traditionally known as Poothkulli, woven from unbleached cotton and embroidered with red and black wool.',
            source_id=s3.id
        )
        db.add(tq1)
        db.commit()
        db.add_all([
            models.QuizOption(question_id=tq1.id, option_text='Poothkulli', is_correct=True, order_index=1),
            models.QuizOption(question_id=tq1.id, option_text='Kasavu', is_correct=False, order_index=2),
            models.QuizOption(question_id=tq1.id, option_text='Pheran', is_correct=False, order_index=3),
            models.QuizOption(question_id=tq1.id, option_text='Gamusa', is_correct=False, order_index=4),
        ])

        tq2 = models.QuizQuestion(
            quiz_id=q_toda.id,
            question_text='How do Toda women execute their geometric embroidery patterns without tracing or stenciling designs?',
            order_index=2,
            explanation='Toda embroidery is a counted-thread technique executed by meticulously counting warp and weft yarns directly with the needle.',
            source_id=s3.id
        )
        db.add(tq2)
        db.commit()
        db.add_all([
            models.QuizOption(question_id=tq2.id, option_text='By counting warp and weft threads on the fabric', is_correct=True, order_index=1),
            models.QuizOption(question_id=tq2.id, option_text='Using carved wooden printing blocks', is_correct=False, order_index=2),
            models.QuizOption(question_id=tq2.id, option_text='By transferring patterns with charcoal stencils', is_correct=False, order_index=3),
            models.QuizOption(question_id=tq2.id, option_text='Freehand painting before stitching', is_correct=False, order_index=4),
        ])

        tq3 = models.QuizQuestion(
            quiz_id=q_toda.id,
            question_text='Which animal holds central sacred and cultural significance reflected in Toda motifs and daily customs?',
            order_index=3,
            explanation='The Toda are historically pastoralists whose ritual and spiritual life revolves around their sacred water buffalo herds.',
            source_id=s3.id
        )
        db.add(tq3)
        db.commit()
        db.add_all([
            models.QuizOption(question_id=tq3.id, option_text='Nilgiri Water Buffalo', is_correct=True, order_index=1),
            models.QuizOption(question_id=tq3.id, option_text='Nilgiri Tahr', is_correct=False, order_index=2),
            models.QuizOption(question_id=tq3.id, option_text='Lion-tailed Macaque', is_correct=False, order_index=3),
            models.QuizOption(question_id=tq3.id, option_text='Spotted Deer', is_correct=False, order_index=4),
        ])
        db.commit()

        print('Seeding Chhau Dance...')
        t_chhau = models.Tradition(
            name='Chhau Dance',
            slug='chhau',
            region='East',
            state='Jharkhand, West Bengal, Odisha',
            community='Regional Performing Akhadas & Traditional Mask Artisans',
            category='Dance / Performing Arts',
            short_description='A martial and folkloric dance tradition of Eastern India, celebrated in three distinct regional styles.',
            description='Chhau dance is a traditional dance-theatre tradition originating from Eastern India. Inscribed on the UNESCO Representative List in 2010, it enacts episodes from the epics (Mahabharata and Ramayana), regional folklore, and abstract themes of nature. The tradition comprises three distinct regional styles: Seraikella (Jharkhand), Purulia (West Bengal), and Mayurbhanj (Odisha).',
            historical_context='Historically evolved from indigenous martial arts exercises (Parikhanda - shield and sword training) and tribal harvest dances. It received royal patronage from regional rulers as well as deep participation from rural communities.',
            cultural_significance='Chhau is celebrated primarily during the spring festival of Chaitra Parva. It brings together diverse social strata in open-air night performances accompanied by the resonant beats of the dhol, nagara, and shehnai.',
            preservation_context='UNESCO documentation notes that while the tradition remains vibrant, it faces economic pressures, migration, and challenges in sustaining traditional mask-making communities.',
            experience_type='PERFORMANCE_EXPLORER',
            hero_image='/heritage-images/chhau.jpg',
            thumbnail='/heritage-images/chhau.jpg',
            status='PUBLISHED'
        )
        t_chhau.sources.extend([s5, s6])
        db.add(t_chhau)
        db.commit()

        exp_chhau = models.Experience(
            tradition_id=t_chhau.id,
            type='PERFORMANCE_EXPLORER',
            title='Chhau Performance Explorer: Three Distinct Regional Styles',
            description='Compare the masks, movement vocabulary, music, and performance contexts of Seraikella, Purulia, and Mayurbhanj.'
        )
        db.add(exp_chhau)
        db.commit()

        chhau_items = [
            ('Seraikella: Stylized Papier-Mâché Masks', 'Dancers wear delicate, pastel-tinted papier-mâché masks that convey idealized, poetic characters. Because the mask has no moving parts, emotion is expressed through subtle head tilts and body postures.', 'Expresses bhava (emotion) through symbolic facial calm and expressive body angles.', 'Lightweight papier-mâché, clay mold, organic paints', s5.id, 'Seraikella'),
            ('Seraikella: Parikhanda Martial Grace', 'Movements are structured into Topkas (gliding steps) and Upalayas (leg leaps and animal imitations such as the gait of a peacock or crane), blending martial agility with lyrical lyricism.', 'Derived directly from historic sword-and-shield combat drills of the Seraikella royal court.', 'Shield (Pari), Sword (Khanda) footwork', s6.id, 'Seraikella'),
            ('Seraikella: Chaitra Parva Performance', 'Performed annually at the Royal Palace courtyard and community grounds during the Chaitra Parva spring festival in April.', 'Marks the transition of seasons and invocation of Lord Shiva and Ardhanarishwara.', 'Open-air night arena', s5.id, 'Seraikella'),
            ('Purulia: Vibrant Charida Masks & Headdresses', 'Handcrafted in Charida village (Baghmundi, Purulia), these oversized, theatrical masks feature flamboyant feathered crowns, vibrant clay pigments, and fierce expressions differentiating Devatas (gods) from Asuras (demons).', 'Charida village represents a multi-generational artisan community specialized in clay and sholapith mask crafting.', 'Clay molds, Paper layers, Fabric, Sholapith, Feathered crowns', s6.id, 'Purulia'),
            ('Purulia: Dynamic Acrobatic Combat', 'Characterized by energetic running steps, knee-falls, high leaps, and 360-degree mid-air somersaults dramatizing mythic clashes between Durga and Mahishasura.', 'Physical athleticism reflects village akhada discipline and valor.', 'Acrobatic martial routines', s5.id, 'Purulia'),
            ('Purulia: Village Gajan & Chaitra Festivals', 'Performed during the sun festival (Gajan) and Chaitra Parva in village akhadas throughout Purulia and Bankura.', 'Community-funded open-air performances extending through the entire night.', 'Village clearing, Akhada ground', s6.id, 'Purulia'),
            ('Mayurbhanj: Maskless Facial & Body Expression', 'Unique among the three styles, Mayurbhanj Chhau dancers do NOT wear masks. Instead, expressive facial glances, eye movements, and dynamic neck isolations communicate dramatic narrative.', 'Allows dancers uninhibited peripheral vision and nuanced emotional projection directly through the face.', 'Bare-faced with traditional turban/headdress', s5.id, 'Mayurbhanj'),
            ('Mayurbhanj: Chalis & Dharans Martial Stances', 'The movement vocabulary comprises six basic Chalis (disciplined walks and stances) and 36 Upalayas derived from ancient Odia military exercises.', 'Cultivated under the royal patronage of the Bhanja rulers of Mayurbhanj.', 'Traditional swords, Bows, Staves', s6.id, 'Mayurbhanj'),
            ('Mayurbhanj: Baripada Arena Performance', 'Presented in Baripada during the annual Chaitra Parva festival, where two traditional performing groups (Uttar Sahi and Dakshin Sahi) present choreographies in artistic rivalry.', 'Civic celebration honoring Nataraja and springtime renewal.', 'Baripada palace arena, Community stages', s5.id, 'Mayurbhanj'),
            ('Rhythmic Ensemble: Dhol, Nagara & Dhumsa', 'The musical accompaniment is propelled by high-energy percussion: the cylindrical barrel Dhol, the massive kettle-drum Dhumsa (struck with heavy wooden sticks), and the rhythmic Chadchadi.', 'Drum patterns signal character entrances and dictate acceleration into battle stances.', 'Dhol, Dhumsa, Nagara, Chadchadi', s5.id, 'Music'),
            ('Melodic Reeds: Mohuri & Shehnai', 'The melodic thread is carried by the Mohuri (a double-reed wind pipe) and Shehnai, weaving folk ragas such as Jhumur and classical melodies with rhythmic drumming.', 'Sets the thematic mood before martial combat sequences commence.', 'Mohuri, Shehnai, Reed flutes', s5.id, 'Music')
        ]

        for i, (title, desc, context, tools, src_id, style) in enumerate(chhau_items, 1):
            db.add(models.ExperienceItem(
                experience_id=exp_chhau.id,
                title=title,
                order_index=i,
                category_or_style=style,
                description=desc,
                cultural_context=context,
                regional_perspective='Curated across Jharkhand, West Bengal, and Odisha.',
                tool_or_material=tools,
                source_id=src_id
            ))
        db.commit()

        q_chhau = models.Quiz(
            tradition_id=t_chhau.id,
            title='Chhau Dance Quiz',
            description='Test your understanding of the three regional styles of Chhau dance.'
        )
        db.add(q_chhau)
        db.commit()

        cq1 = models.QuizQuestion(
            quiz_id=q_chhau.id,
            question_text='Which of the three regional styles of Chhau dance is traditionally performed WITHOUT wearing masks?',
            order_index=1,
            explanation='Dancers in Mayurbhanj Chhau (Odisha) perform bare-faced, relying on facial expressions, eye movements, and disciplined martial footwork.',
            source_id=s5.id
        )
        db.add(cq1)
        db.commit()
        db.add_all([
            models.QuizOption(question_id=cq1.id, option_text='Mayurbhanj Chhau (Odisha)', is_correct=True, order_index=1),
            models.QuizOption(question_id=cq1.id, option_text='Purulia Chhau (West Bengal)', is_correct=False, order_index=2),
            models.QuizOption(question_id=cq1.id, option_text='Seraikella Chhau (Jharkhand)', is_correct=False, order_index=3),
            models.QuizOption(question_id=cq1.id, option_text='Charida Chhau', is_correct=False, order_index=4),
        ])

        cq2 = models.QuizQuestion(
            quiz_id=q_chhau.id,
            question_text='Which village in Purulia district, West Bengal, is famous for handcrafting the elaborate masks and feathered headgear worn in Purulia Chhau?',
            order_index=2,
            explanation='Charida village in Baghmundi, Purulia, is the historic artisan colony dedicated to hand-sculpting theatrical Chhau masks.',
            source_id=s6.id
        )
        db.add(cq2)
        db.commit()
        db.add_all([
            models.QuizOption(question_id=cq2.id, option_text='Charida', is_correct=True, order_index=1),
            models.QuizOption(question_id=cq2.id, option_text='Raghurajpur', is_correct=False, order_index=2),
            models.QuizOption(question_id=cq2.id, option_text='Bankura', is_correct=False, order_index=3),
            models.QuizOption(question_id=cq2.id, option_text='Shantiniketan', is_correct=False, order_index=4),
        ])

        cq3 = models.QuizQuestion(
            quiz_id=q_chhau.id,
            question_text='Which annual spring festival is historically the central occasion for Chhau dance performances across Eastern India?',
            order_index=3,
            explanation='Chaitra Parva, celebrated in the month of Chaitra (March-April), is the premier spring festival associated with Chhau performances.',
            source_id=s5.id
        )
        db.add(cq3)
        db.commit()
        db.add_all([
            models.QuizOption(question_id=cq3.id, option_text='Chaitra Parva', is_correct=True, order_index=1),
            models.QuizOption(question_id=cq3.id, option_text='Durga Puja', is_correct=False, order_index=2),
            models.QuizOption(question_id=cq3.id, option_text='Makar Sankranti', is_correct=False, order_index=3),
            models.QuizOption(question_id=cq3.id, option_text='Rath Yatra', is_correct=False, order_index=4),
        ])
        db.commit()

        print('Seeding Warli Painting (Flagship AR)...')
        t_warli = models.Tradition(
            name='Warli Painting',
            slug='warli',
            region='West',
            state='Maharashtra',
            community='Warli Indigenous Adivasi Community',
            category='Visual Art',
            short_description='Ancient geometric tribal painting tradition rooted in the Sahyadri mountains of Maharashtra.',
            description='Warli painting is an indigenous art tradition practiced by the Warli tribe residing primarily in the North Sahyadri mountain range of Maharashtra (Palghar and Thane districts). Using a stark visual vocabulary of circles, triangles, and lines painted with white rice paste on ochre-coated mud walls, the art documents community rituals, nature harmony, and seasonal cycles.',
            historical_context='Documented in archaeological and ethnographic studies by INTACH and tribal research institutes as having roots extending back multiple generations in the Sahyadris. Traditionally created by women (Suhasinis) to consecrate wedding enclosures.',
            cultural_significance='Central to Warli worldview is an egalitarian reverence for nature without anthropocentric dominance. The sacred square (chauk) enshrines Palaghata (goddess of corn and fertility), while the Tarpa dance spiral mirrors cosmic cycles without beginning or end.',
            preservation_context='Registered under Geographical Indication No. 342. Safeguarding initiatives emphasize protecting tribal intellectual property and documenting oral traditions linked to specific icons.',
            experience_type='AR_STORY',
            hero_image='/heritage-images/warli.jpg',
            thumbnail='/heritage-images/warli.jpg',
            status='PUBLISHED'
        )
        t_warli.sources.extend([s7, s8])
        db.add(t_warli)
        db.commit()

        ar_warli = models.ARExperience(
            tradition_id=t_warli.id,
            target_image='/ar-assets/warli-target.jpg',
            target_descriptor='/ar-assets/warli-target',
            instructions='Point your device camera at the physical Warli artwork or poster. Keep the artwork centered and well-lit to reveal interactive hotspots.',
            status='ACTIVE'
        )
        db.add(ar_warli)
        db.commit()

        hotspots = [
            models.ARHotspot(
                ar_experience_id=ar_warli.id,
                name='The Flute Player (Pawa / Bansuri Musician)',
                x=34.0,
                y=56.0,
                content='Traditional tribal musician playing the double-reed bamboo wind flute (Pawa), adorned with an auspicious peacock-feather crest (Mor-Pankh).',
                cultural_context='Music in Warli tribal culture is an invocation of seasonal vitality, joyous courtship, and nature harmony during autumn and spring gatherings.',
                regional_perspective='Documented by INTACH Dahanu Chapter and GI Registry No. 342 as a primary celebratory figure in Sahyadri tribal folklore.',
                source_id=s7.id,
                audio_url=None,
                animation_type='pulse'
            ),
            models.ARHotspot(
                ar_experience_id=ar_warli.id,
                name='The Dancing Maiden (Celebration Partner)',
                x=56.0,
                y=55.0,
                content='Female celebration partner depicted with two inverted triangles joined at the tip, wearing a traditional draped veil (Padar) with expressive rhythmic hand posture.',
                cultural_context='The two triangles symbolize the balance of masculine (Purusha) and feminine (Prakriti) energies sustaining cosmic order and tribal community continuity.',
                regional_perspective='Documented in GI Application 342 as the quintessential geometric human form canonical to Warli visual iconography.',
                source_id=s8.id,
                audio_url=None,
                animation_type='glow'
            ),
            models.ARHotspot(
                ar_experience_id=ar_warli.id,
                name='The Sacred Tree of Life (Devrai Canopy)',
                x=34.0,
                y=22.0,
                content='Sprawling arboreal canopy of the sacred Mahua or Banyan tree, sheltering singing birds and peacocks, connecting earth to the cosmos.',
                cultural_context='Warli communities venerate sacred forest groves (Devrai). Living trees are never felled indiscriminately; nature is revered as equal kin.',
                regional_perspective='Field research by INTACH Dahanu documents sacred tree veneration across Palghar and Thane tribal settlements.',
                source_id=s7.id,
                audio_url=None,
                animation_type='float'
            ),
            models.ARHotspot(
                ar_experience_id=ar_warli.id,
                name='The Radiant Sun God (Hirva / Surya Dev)',
                x=77.0,
                y=16.0,
                content='Concentric solar disk with dynamic triangular light rays illuminating the cosmic tree and dancing figures.',
                cultural_context='The sun represents diurnal time, photosynthesis for monsoon crops, and the divine witness to community festivals and rituals.',
                regional_perspective='Documented by INTACH as the celestial life-giver watching over the North Sahyadri hills.',
                source_id=s7.id,
                audio_url=None,
                animation_type='pulse'
            ),
            models.ARHotspot(
                ar_experience_id=ar_warli.id,
                name='Sacred Forest Fauna (Peacocks & Cattle)',
                x=48.0,
                y=92.0,
                content='Stylized peacocks (Mor) and resting cattle depicted beneath the dancers, signifying ecological companionship.',
                cultural_context='Peacocks are revered as heralds of monsoon rains, while cattle reflect agrarian companionship and shared unstratified labor.',
                regional_perspective='GI Registry No. 342 highlights animal and bird motifs as central to Warli pastoral harmony.',
                source_id=s8.id,
                audio_url=None,
                animation_type='bounce'
            ),
            models.ARHotspot(
                ar_experience_id=ar_warli.id,
                name='Sacred Chevron Border (Patti / Toran)',
                x=50.0,
                y=5.5,
                content='Continuous repeating triangular chevron borders framing the entire sacred canvas.',
                cultural_context='Known as Patti, this geometric border consecrates the painting, protecting the inner ceremonial narrative from malevolent external influences.',
                regional_perspective='Traditional Suhasini artists always outline the protective triangular border first before beginning interior figurative work.',
                source_id=s7.id,
                audio_url=None,
                animation_type='glow'
            )
        ]
        db.add_all(hotspots)
        db.commit()

        exp_warli = models.Experience(
            tradition_id=t_warli.id,
            type='AR_STORY',
            title='Warli Sacred Art & Symbology Explorer',
            description='Explore verified iconographic elements of Warli tribal painting with interactive hotspots, cultural context, and WebAR camera recognition.'
        )
        db.add(exp_warli)
        db.commit()

        warli_items = [
            ('The Tarpa Spiral Dance', 'Men and women entwine arms, dancing in an ever-widening spiral around the central player of the Tarpa wind instrument.', 'Spiral dancers move counter-clockwise, symbolizing the cyclic rhythm of nature and seasonal transitions without beginning or end.', 'Tarpa wind instrument (gourd and bamboo), Bamboo twig brush', s7.id),
            ('Mother Goddess Palaghata & Sacred Chauk', 'Inside the sacred square (Lagna chauk) sits Palaghata, the goddess of corn, trees, and fertility.', 'Painted by married women (Suhasinis) during wedding rites to invoke blessings for harvest abundance and family prosperity.', 'White rice paste, Ochre mud plaster, Bamboo stylus', s7.id),
            ('Sacred Tree of Life & Forest Fauna', 'Stylized branching trees shelter peacocks, monkeys, squirrels, and birds, connecting subterranean earth with the celestial sky.', 'Warli worldview reflects symbiotic harmony with nature; sacred groves (Devrai) are protected across the Sahyadri range.', 'Natural white rice pigment, Geru (red ochre) background', s7.id),
            ('Agricultural Cultivation & Grain Pounding', 'Scenes of farmers plowing with bullocks, women pounding paddy with wooden pestles, and carrying bundles of monsoon crops.', 'Reflects daily subsistence rooted in the monsoon cycle (Kharif paddy). Labor is shared communally without social stratification.', 'Bamboo brush, Rice flour paste', s8.id)
        ]

        for i, (title, desc, context, tools, src_id) in enumerate(warli_items, 1):
            db.add(models.ExperienceItem(
                experience_id=exp_warli.id,
                title=title,
                order_index=i,
                category_or_style='Iconography',
                description=desc,
                cultural_context=context,
                regional_perspective='Documented by INTACH Dahanu Chapter and GI Registry Application 342.',
                tool_or_material=tools,
                source_id=src_id
            ))
        db.commit()

        q_warli = models.Quiz(
            tradition_id=t_warli.id,
            title='Warli Painting Quiz',
            description='Test your knowledge of authentic Warli tribal art, iconography, and cultural context.'
        )
        db.add(q_warli)
        db.commit()

        wq1 = models.QuizQuestion(
            quiz_id=q_warli.id,
            question_text='What natural substance is traditionally ground and mixed with water and tree gum to produce the white paint in authentic Warli wall art?',
            order_index=1,
            explanation='Warli painters prepare their signature white pigment by grinding rice into a fine paste and binding it with natural gum extracted from babool or khair trees.',
            source_id=s7.id
        )
        db.add(wq1)
        db.commit()
        db.add_all([
            models.QuizOption(question_id=wq1.id, option_text='Rice powder paste', is_correct=True, order_index=1),
            models.QuizOption(question_id=wq1.id, option_text='Chalk powder', is_correct=False, order_index=2),
            models.QuizOption(question_id=wq1.id, option_text='Limestone whitewash', is_correct=False, order_index=3),
            models.QuizOption(question_id=wq1.id, option_text='White marble dust', is_correct=False, order_index=4),
        ])

        wq2 = models.QuizQuestion(
            quiz_id=q_warli.id,
            question_text='What traditional wind instrument crafted from a dried bottle gourd and bamboo forms the musical centre of the spiral Warli community dance?',
            order_index=2,
            explanation='The Tarpa is a traditional aerophone crafted from a dried bottle gourd and bamboo, played by an elder around whom community dancers form expanding spirals.',
            source_id=s7.id
        )
        db.add(wq2)
        db.commit()
        db.add_all([
            models.QuizOption(question_id=wq2.id, option_text='Tarpa', is_correct=True, order_index=1),
            models.QuizOption(question_id=wq2.id, option_text='Shehnai', is_correct=False, order_index=2),
            models.QuizOption(question_id=wq2.id, option_text='Pungi', is_correct=False, order_index=3),
            models.QuizOption(question_id=wq2.id, option_text='Algoza', is_correct=False, order_index=4),
        ])

        wq3 = models.QuizQuestion(
            quiz_id=q_warli.id,
            question_text='In traditional Warli ceremonial paintings, which goddess of corn, trees, and fertility is enshrined inside the sacred central square (chauk)?',
            order_index=3,
            explanation='Goddess Palaghata is the deity of corn and fertility painted inside the sacred wedding square (Lagna chauk) by married women.',
            source_id=s7.id
        )
        db.add(wq3)
        db.commit()
        db.add_all([
            models.QuizOption(question_id=wq3.id, option_text='Palaghata', is_correct=True, order_index=1),
            models.QuizOption(question_id=wq3.id, option_text='Saraswati', is_correct=False, order_index=2),
            models.QuizOption(question_id=wq3.id, option_text='Kansari', is_correct=False, order_index=3),
            models.QuizOption(question_id=wq3.id, option_text='Narayandev', is_correct=False, order_index=4),
        ])
        db.commit()

        # Admin User initialization
        import os
        admin_pass = os.getenv('ADMIN_PASSWORD') or os.getenv('ADMIN_DEFAULT_PASSWORD')
        if admin_pass:
            admin_user = models.User(
                username='admin',
                email='admin@parampara.heritage',
                hashed_password=auth.get_password_hash(admin_pass),
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
            print("Admin account initialized (username: 'admin').")
        else:
            print("\n[SECURITY NOTICE] No ADMIN_PASSWORD provided in environment.")
            print("To create or configure your first administrator, run:")
            print("   python -m app.create_admin --username admin --email admin@parampara.heritage\n")

        print("Database seeded successfully with 4 verified traditions, 8 archival sources, 4 quizzes, and AR target configuration!")
    except Exception as e:
        db.rollback()
        print(f'Error seeding database: {e}')
        raise e
    finally:
        db.close()

if __name__ == '__main__':
    seed_database()
