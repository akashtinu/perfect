package com.jbncakes.backend.config;

import com.jbncakes.backend.model.Product;
import com.jbncakes.backend.model.User;
import com.jbncakes.backend.repository.ProductRepository;
import com.jbncakes.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed default Admin and Customer if DB is empty
        if (userRepository.count() == 0) {
            User admin = new User(
                    "JBN Admin",
                    "admin@jbncakes.com",
                    passwordEncoder.encode("admin123"),
                    "ADMIN",
                    "9876543210",
                    "JBN Bakery Head Office, City Center"
            );
            userRepository.save(admin);

            User customer = new User(
                    "Sample Customer",
                    "customer@jbncakes.com",
                    passwordEncoder.encode("customer123"),
                    "CUSTOMER",
                    "9123456789",
                    "77 Sweet Avenue, Bakery District"
            );
            userRepository.save(customer);

            System.out.println(">>> Initialized default Admin (admin@jbncakes.com / admin123) and Customer (customer@jbncakes.com / customer123)");
        }

        // Seed default products if empty
        if (productRepository.count() == 0) {
            List<Product> defaultProducts = Arrays.asList(
                    new Product("Vanilla Cake", "Classic soft & fluffy vanilla sponge layered with silky vanilla buttercream and sweet colorful sprinkles.", new BigDecimal("500.00"), "cake", "Popular", "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500", true),
                    new Product("Rasamalai Cake", "Authentic Indian fusion cake infused with cardamom sponge, saffron syrup, pistachio crunch, and real juicy rasamalai toppings.", new BigDecimal("600.00"), "cake", "Bestseller", "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500", true),
                    new Product("Chocolate Cake", "Rich, moist chocolate sponge coated with dark chocolate frosting and topped with glossy cherries.", new BigDecimal("600.00"), "cake", "Popular", "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500", true),
                    new Product("Red Velvet Cake", "Decadent crimson cocoa cake layered with smooth, whipped cream cheese frosting and fine red velvet crumbs.", new BigDecimal("550.00"), "cake", "Trending", "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=500", true),
                    new Product("Tender Coconut Cake", "Light tropical cake made with real coconut milk, tender coconut flesh, and fluffy light cream filling.", new BigDecimal("650.00"), "cake", null, "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=500", true),
                    new Product("Black Forest Cake", "Traditional German chocolate sponge layered with fresh whipped cream, sweet cherry compote, and dark chocolate shavings.", new BigDecimal("550.00"), "cake", null, "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500", true),
                    new Product("White Forest Cake", "Delicate vanilla sponge filled with juicy cherries, white chocolate curls, and light whipped cream.", new BigDecimal("550.00"), "cake", null, "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500", true),
                    new Product("Choco Truffle Cake", "Ultimate indulgence featuring dense chocolate cake layered with rich, melted dark chocolate ganache truffle.", new BigDecimal("600.00"), "cake", "Popular", "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500", true),
                    new Product("Honey Cake", "Classic bakery favorite soaked in pure honey syrup, layered with mixed fruit jam, and coated in fresh coconut flakes.", new BigDecimal("550.00"), "cake", null, "https://images.unsplash.com/photo-1519869325930-281384150729?w=500", true),
                    new Product("Butterscotch Cake", "Moist vanilla cake layered with crunch butterscotch pralines, rich caramel sauce, and smooth whipped cream.", new BigDecimal("500.00"), "cake", null, "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500", true),
                    new Product("Rose Milk Cake", "Soft eggless sponge cake infused with aromatic rose milk, cardamom cream, and crushed dried rose petals.", new BigDecimal("600.00"), "cake", "Popular", "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500", true),
                    new Product("Blueberry Cake", "Refreshing vanilla sponge layered with homemade wild blueberry compote and silky cream cheese.", new BigDecimal("650.00"), "cake", null, "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=500", true),
                    new Product("Fudge Walnut Brownie", "Chewy dark chocolate brownie loaded with roasted walnuts and gooey chocolate chunks.", new BigDecimal("120.00"), "brownie", "Bestseller", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500", true),
                    new Product("Nutella Loaded Brownie", "Rich fudgy brownie smothered with warm creamy Nutella hazelnut spread.", new BigDecimal("150.00"), "brownie", "Popular", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500", true),
                    new Product("Triple Choco Brownie", "Melt-in-your-mouth brownie made with milk, dark, and white chocolate layers.", new BigDecimal("140.00"), "brownie", "Popular", "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500", true)
            );

            productRepository.saveAll(defaultProducts);
            System.out.println(">>> Initialized 15 default products in database.");
        }
    }
}
