-- Seed Data for JBN Cakes

-- Default Passwords (BCrypt encrypted):
-- Admin: admin123  => $2a$10$eD7x74fKjG7Yf14M5uE... (Spring Boot handles automatic hashing)
-- Note: Spring Boot initializer will also seed initial data automatically if DB is empty.

INSERT INTO users (name, email, password, role, phone, address) VALUES
('Default Admin', 'admin@jbncakes.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVym50cr057xUq.jD.mZ71.u', 'ADMIN', '9876543210', 'JBN Cakes HQ, City Main Road'),
('John Customer', 'customer@jbncakes.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVym50cr057xUq.jD.mZ71.u', 'CUSTOMER', '9123456789', '123 Baker Street, City');

INSERT INTO products (name, description, price, category, tag, image_url, available) VALUES
('Vanilla Cake', 'Classic soft & fluffy vanilla sponge layered with silky vanilla buttercream and sweet colorful sprinkles.', 500.00, 'cake', 'Popular', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500', TRUE),
('Rasamalai Cake', 'Authentic Indian fusion cake infused with cardamom sponge, saffron syrup, pistachio crunch, and real juicy rasamalai toppings.', 600.00, 'cake', 'Bestseller', 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500', TRUE),
('Chocolate Fudge Cake', 'Rich, moist chocolate sponge coated with dark chocolate frosting and topped with glossy cherries.', 600.00, 'cake', 'Popular', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500', TRUE),
('Red Velvet Cake', 'Decadent crimson cocoa cake layered with smooth, whipped cream cheese frosting and fine red velvet crumbs.', 550.00, 'cake', 'Trending', 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=500', TRUE),
('Tender Coconut Cake', 'Light tropical cake made with real coconut milk, tender coconut flesh, and fluffy light cream filling.', 650.00, 'cake', NULL, 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=500', TRUE),
('Black Forest Cake', 'Traditional German chocolate sponge layered with fresh whipped cream, sweet cherry compote, and dark chocolate shavings.', 550.00, 'cake', NULL, 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500', TRUE),
('White Forest Cake', 'Delicate vanilla sponge filled with juicy cherries, white chocolate curls, and light whipped cream.', 550.00, 'cake', NULL, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500', TRUE),
('Choco Truffle Cake', 'Ultimate indulgence featuring dense chocolate cake layered with rich, melted dark chocolate ganache truffle.', 600.00, 'cake', 'Popular', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500', TRUE),
('Fudge Walnut Brownie', 'Chewy dark chocolate brownie loaded with roasted walnuts and gooey chocolate chunks.', 120.00, 'brownie', 'Bestseller', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500', TRUE),
('Triple Choco Brownie', 'Melt-in-your-mouth brownie made with milk, dark, and white chocolate layers.', 140.00, 'brownie', 'Popular', 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500', TRUE);
