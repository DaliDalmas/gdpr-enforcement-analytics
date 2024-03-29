# gdpr-enforcement-analytics

Data is scraped from https://www.enforcementtracker.com/

![Alt text](image.png)

creating the table in the db
```
create table clean_gdpr (
	etid VARCHAR,
	country VARCHAR,
	date_of_decision DATE,
	fine VARCHAR,
	controller_or_processor VARCHAR,
	quoted_art VARCHAR,
	fine_type VARCHAR
);
```

creating user 
```
create user gdpr with password 'gdpr';
grant all PRIVILEGES ON ALL TABLES IN SCHEMA public to gdpr;
```

make the user an owner
```
ALTER TABLE clean_gdpr OWNER TO gdpr;
```
