describe('Burger Constructor', () => {
  beforeEach(() => {
    // Mock ingredients API
    cy.intercept('GET', 'api/ingredients', {
      statusCode: 200,
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Visit app
    cy.visit('/');

    // Wait for the ingredients request to complete
    cy.wait('@getIngredients');
  });
  describe('Basic setup with ingredient mocking', () => {
    it('should load and display ingredients from mock data', () => {
      // Basic page load check
      cy.contains('Соберите бургер').should('be.visible');

      // Check that ingredients are loaded by verifying the container exists
      cy.get('[data-testid=ingredient-item]').should('exist');

      // Check that we have the expected number of ingredients (8 from fixtures)
      cy.get('[data-testid=ingredient-item]').should('have.length', 8);
    });

    it('should display all main UI components', () => {
      // Check critical UI elements that should always be visible
      cy.contains('Соберите бургер').should('be.visible');
      cy.contains('Булки').should('be.visible');
      cy.contains('Соусы').should('be.visible');
      cy.contains('Начинки').should('be.visible');
      cy.get('[data-testid=order-button]').should('be.visible');
    });

    it('should have working ingredient cards', () => {
      // Check the first visible ingredient card (always in viewport)
      cy.get('[data-testid=ingredient-item]')
        .first()
        .should('be.visible')
        .within(() => {
          cy.get('img').should('be.visible');
          cy.contains('Добавить').should('be.visible');
        });
    });

    it('should verify mock data content by checking specific elements', () => {
      // Instead of checking visibility of all ingredients (which might be scrolled),
      // check that the page contains text from mock

      // Check for bun names
      cy.contains('Краторная булка').should('exist');
      cy.contains('Флюоресцентная булка').should('exist');

      // Check for main ingredient names
      cy.contains('Говяжий метеорит').should('exist');
      cy.contains('Биокотлета').should('exist');

      // Check for sauce names
      cy.contains('Соус Spicy-X').should('exist');
      cy.contains('Соус традиционный').should('exist');
    });
  });

  describe('Adding ingredients to constructor', () => {
    it('should add a single bun to constructor', () => {
      // Since buns are first in the list, we can safely add the first ingredient
      cy.get('[data-testid=ingredient-item]')
        .first()
        .within(() => {
          cy.contains('Добавить').click();
        });

      // Verify the bun was added to constructor
      cy.get('[data-testid=constructor-bun-top]').should(
        'not.contain',
        'Выберите булки'
      );

      cy.get('[data-testid=constructor-bun-top]').should('contain', 'булка');
      cy.get('[data-testid=constructor-bun-bottom]').should('contain', 'булка');
    });

    it('should add a single main ingredient to constructor', () => {
      // Click mains tab and wait for scroll
      cy.contains('Начинки').click({ force: true });
      cy.wait(1000); // waiting for scroll

      // Find a main ingredient by its content (not a bun, not a sauce)
      cy.get('[data-testid=ingredient-item]').then(($ingredients) => {
        let mainFound = false;

        // Look through ingredients to find a main ingredient
        $ingredients.each((index, ingredient) => {
          const text = ingredient.textContent;
          // Look for main ingredients (not buns, not sauces)
          if (
            text &&
            !text.includes('булка') &&
            !text.includes('соус') &&
            !mainFound
          ) {
            mainFound = true;
            cy.wrap(ingredient)
              .scrollIntoView()
              .within(() => {
                cy.contains('Добавить').click();
              });
          }
        });

        // If no main found by text, try the first ingredient after tab click
        if (!mainFound) {
          cy.get('[data-testid=ingredient-item]')
            .first()
            .scrollIntoView()
            .within(() => {
              cy.contains('Добавить').click();
            });
        }
      });

      // Verify main ingredient was added
      cy.get('[data-testid=constructor-main-area]')
        .children()
        .should('have.length', 1);
    });

    it('should add bun and main ingredient to constructor', () => {
      // Add a bun (first ingredient is always a bun)
      cy.get('[data-testid=ingredient-item]')
        .first()
        .within(() => {
          cy.contains('Добавить').click();
        });

      // Verify bun was added
      cy.get('[data-testid=constructor-bun-top]').should(
        'not.contain',
        'Выберите булки'
      );

      // Add a main ingredient
      cy.contains('Начинки').click({ force: true });
      cy.wait(1000);

      // Find and add a main ingredient
      cy.get('[data-testid=ingredient-item]').then(($ingredients) => {
        let mainAdded = false;

        $ingredients.each((index, ingredient) => {
          const text = ingredient.textContent;
          if (
            text &&
            !text.includes('булка') &&
            !text.includes('соус') &&
            !mainAdded
          ) {
            mainAdded = true;
            cy.wrap(ingredient)
              .scrollIntoView()
              .within(() => {
                cy.contains('Добавить').click();
              });
          }
        });
      });

      // Verify both were added
      cy.get('[data-testid=constructor-bun-top]').should('contain', 'булка');
      cy.get('[data-testid=constructor-main-area]')
        .children()
        .should('have.length', 1);
    });

    it('should update ingredient counters when added', () => {
      // Add a bun and check counter
      cy.get('[data-testid=ingredient-item]')
        .first()
        .within(() => {
          cy.contains('Добавить').click();
          // Counter should appear or update
          cy.get('.counter').should('exist');
        });
    });
  });

  describe('Modal windows', () => {
    it('should open ingredient details modal when clicking an ingredient', () => {
      // Click on any ingredient to open modal
      cy.get('[data-testid=ingredient-item]').first().click();

      // Verify modal opens
      cy.get('[data-testid=modal]').should('be.visible');

      // Verify modal contains ingredient details
      cy.get('[data-testid=ingredient-details]').should('be.visible');
      cy.get('[data-testid=ingredient-details-name]').should('not.be.empty');
      cy.get('[data-testid=ingredient-details-image]').should('be.visible');

      // Verify nutritional information is displayed
      cy.contains('Калории').should('be.visible');
      cy.contains('Белки').should('be.visible');
      cy.contains('Жиры').should('be.visible');
      cy.contains('Углеводы').should('be.visible');
    });

    it('should display correct ingredient information in modal', () => {
      // Get ingredient name from the list
      let ingredientName = '';
      cy.get('[data-testid=ingredient-item]')
        .first()
        .within(() => {
          cy.get('p')
            .invoke('text')
            .then((text) => {
              ingredientName = text.trim();
            });
        });

      // Click ingredient to open modal
      cy.get('[data-testid=ingredient-item]').first().click();

      // Verify modal shows the same ingredient name
      cy.get('[data-testid=ingredient-details-name]').should(
        'contain',
        ingredientName
      );

      // Verify all nutritional values are present and numeric
      cy.get('[data-testid=ingredient-details-calories]').should(
        'not.be.empty'
      );
      cy.get('[data-testid=ingredient-details-proteins]').should(
        'not.be.empty'
      );
      cy.get('[data-testid=ingredient-details-fat]').should('not.be.empty');
      cy.get('[data-testid=ingredient-details-carbs]').should('not.be.empty');
    });

    it('should close modal by clicking the close button', () => {
      // Open modal
      cy.get('[data-testid=ingredient-item]').first().click();
      cy.get('[data-testid=modal]').should('be.visible');

      // Click close button
      cy.get('[data-testid=modal-close]').click();

      // Verify modal is closed
      cy.get('[data-testid=modal]').should('not.exist');

      // Verify we're back on the main page
      cy.contains('Соберите бургер').should('be.visible');
    });

    it('should close modal by clicking the overlay', () => {
      // Open modal
      cy.get('[data-testid=ingredient-item]').first().click();
      cy.get('[data-testid=modal]').should('be.visible');

      // Click on modal overlay
      cy.get('[data-testid=modal-overlay]').click({ force: true });

      // Verify modal is closed
      cy.get('[data-testid=modal]').should('not.exist');

      // Verify we're back on the main page
      cy.contains('Соберите бургер').should('be.visible');
    });
  });

  describe('Order creation - authenticated', () => {
    beforeEach(() => {
      // Mock APIs for order creation and user data
      cy.intercept('POST', 'api/orders', {
        statusCode: 200,
        fixture: 'order.json'
      }).as('createOrder');

      cy.intercept('GET', 'api/auth/user', {
        statusCode: 200,
        fixture: 'user.json'
      }).as('getUser');

      // Mock authorization tokens - supply them before order creation
      cy.setCookie('accessToken', 'test-access-token');
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });
    });

    afterEach(() => {
      // Clean up tokens after each test in this describe block
      cy.clearCookies();
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
    });

    it('should create order successfully with bun and main ingredient', () => {
      // The burger is assembled - add ingredients to constructor

      // Add a bun
      cy.get('[data-testid=ingredient-item]')
        .first()
        .within(() => {
          cy.contains('Добавить').click();
        });

      // Add a main ingredient
      cy.contains('Начинки').click({ force: true });
      cy.wait(1000);

      cy.get('[data-testid=ingredient-item]').then(($ingredients) => {
        let mainAdded = false;
        $ingredients.each((index, ingredient) => {
          const text = ingredient.textContent;
          if (
            text &&
            !text.includes('булка') &&
            !text.includes('соус') &&
            !mainAdded
          ) {
            mainAdded = true;
            cy.wrap(ingredient)
              .scrollIntoView()
              .within(() => {
                cy.contains('Добавить').click();
              });
          }
        });
      });

      // Verify burger is assembled (constructor has ingredients)
      cy.get('[data-testid=constructor-bun-top]').should(
        'not.contain',
        'Выберите булки'
      );
      cy.get('[data-testid=constructor-main-area]')
        .children()
        .should('have.length', 1);

      // A click on the "Place Order" button is triggered
      cy.get('[data-testid=order-button]').click();
      cy.get('[data-testid=order-button]').click();

      // It is verified that the modal window opened
      cy.get('[data-testid=modal]').should('be.visible');
      cy.get('[data-testid=order-details]').should('be.visible');

      // and the order number is correct (from order.json mock data)
      cy.get('[data-testid=order-number]').should('contain', '12345');

      // Verify order success message
      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('Ваш заказ начали готовить').should('be.visible');
      cy.get('[data-testid=order-done-image]').should('be.visible');

      // The modal window is closed and its success is verified
      cy.get('[data-testid=modal-close]').click();
      cy.get('[data-testid=modal]').should('not.exist');

      // It is verified that the constructor is empty
      cy.get('[data-testid=constructor-bun-top]').should(
        'contain',
        'Выберите булки'
      );
      cy.get('[data-testid=constructor-main-area]')
        .children()
        .should('have.length', 1);
    });
  });

  describe('Order creation - unauthenticated', () => {
    beforeEach(() => {
      // Ensure no authentication tokens exist for these tests
      cy.clearCookies();
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });

      // Don't mock the order API for unauthenticated tests
      // The app should redirect to login before making the API call
    });

    it('should redirect to login when not authenticated', () => {
      // Add ingredients
      cy.get('[data-testid=ingredient-item]')
        .first()
        .within(() => {
          cy.contains('Добавить').click();
        });

      // Try to place order without authentication
      cy.get('[data-testid=order-button]').click();

      // Should redirect to login page
      cy.url().should('include', '/login');
    });

    it('should not allow order creation without ingredients', () => {
      // Try to place order with empty constructor
      cy.get('[data-testid=order-button]').click();

      // Should either show error or stay on same page
      // Should not redirect to login if no ingredients are selected
      cy.url().should('not.include', '/login');
      cy.contains('Соберите бургер').should('be.visible');
    });
  });
});
