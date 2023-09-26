"use client";
import { useState, useEffect } from "react";

// https://www.npmjs.com/package/react-accessible-accordion

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

type Dining = {
  clarity: string,
  lord_saunders: string,
  heritage: string
}

interface Day<D = Dining> {
  breakfast?: D
  lunch: D
  dinner: D
}

type Menu<D = Dining> = {
  monday: Day<D>
  tuesday: Day<D>
  wednesday: Day<D>
  thursday: Day<D>
  friday: Day<D>
  saturday: Day<D>
  sunday: Day<D>
}

type SteviePlaces = { [k: string]: string };


type StevieMenu = Menu<SteviePlaces>;

type MenuResponse = {
  for_week: number,
  menu: Menu,
  stevie: StevieMenu
}

function StevieCollapse({ places }: { places: SteviePlaces }) {
  const [showChildren, setShowChildren] = useState(false);
  const text = showChildren ? "Hide Menu" : "Show Menu";
  const menus = Object.entries(places).map(val => (<><div>{val[0]}</div><div className="text-gray-700">{val[1]}</div></>));
  return (<>
    <div>Stevie:</div><div><div onClick={() => setShowChildren(!showChildren)} className="text-blue-500 underline hover:text-blue-700 hover:cursor-pointer">{text}</div></div>
    {showChildren ? menus : <></>}
  </>);
}

function Day({ day, stevieMenus }: { day: Day, stevieMenus: Day<SteviePlaces> }) {
  return (
    <div className="p-5  text-gray-500">
      <div className="grid grid-cols-2 mx-auto gap-5">
        <div className="col-span-2 text-black mx-auto">Breakfast</div>
        <StevieCollapse places={stevieMenus.breakfast!} />

        <div className="col-span-2 text-black  mx-auto">Lunch</div>
        <div>Clarity:</div><div className="text-gray-700">{day.lunch.clarity}</div>
        <div>Heritage:</div><div className="text-gray-700">{day.lunch.heritage}</div>
        <div>Lord Saunders:</div><div className="text-gray-700">{day.lunch.lord_saunders}</div>
        <StevieCollapse places={stevieMenus.lunch} />

        <div className="col-span-2 text-black mx-auto">Dinner</div>
        <div>Clarity:</div><div className="text-gray-700">{day.dinner.clarity}</div>
        <div>Heritage:</div><div className="text-gray-700">{day.dinner.heritage}</div>
        <div>Lord Saunders:</div><div className="text-gray-700">{day.dinner.lord_saunders}</div>
        <StevieCollapse places={stevieMenus.dinner} />
      </div>
    </div>)
}

function DayCollapse({ hook, day, dayString, stevieMenus }: { hook: any, day: Day, dayString: string, stevieMenus: Day<SteviePlaces> }) {
  const show = { ...hook[0] };
  show[dayString] = !show[dayString];
  return (
    <>
      <AccordionItemHeading onClick={() => hook[1](show)}>
        <AccordionItemButton>{dayString}</AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel><Day day={day} stevieMenus={stevieMenus} /></AccordionItemPanel>
    </>
  );
}

function AccordionAlwaysOpen({ menu, currentDay, stevie }: { menu: Menu, currentDay: string, stevie: StevieMenu }) {
  const showHook = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: true,
  });

  return (
    <Accordion allowMultipleExpanded allowZeroExpanded preExpanded={[currentDay]}>
      <AccordionItem uuid={"Monday"}><DayCollapse hook={showHook} day={menu.monday} dayString="Monday" stevieMenus={stevie.monday} /></AccordionItem>
      <AccordionItem uuid={"Tuesday"}><DayCollapse hook={showHook} day={menu.tuesday} dayString="Tuesday" stevieMenus={stevie.tuesday} /></AccordionItem>
      <AccordionItem uuid={"Wednesday"}><DayCollapse hook={showHook} day={menu.wednesday} dayString="Wednesday" stevieMenus={stevie.wednesday} /></AccordionItem>
      <AccordionItem uuid={"Thursday"}><DayCollapse hook={showHook} day={menu.thursday} dayString="Thursday" stevieMenus={stevie.thursday} /></AccordionItem>
      <AccordionItem uuid={"Friday"}><DayCollapse hook={showHook} day={menu.friday} dayString="Friday" stevieMenus={stevie.friday} /></AccordionItem>
      <AccordionItem uuid={"Saturday"}><DayCollapse hook={showHook} day={menu.saturday} dayString="Saturday" stevieMenus={stevie.saturday} /></AccordionItem>
      <AccordionItem uuid={"Sunday"}><DayCollapse hook={showHook} day={menu.sunday} dayString="Sunday" stevieMenus={stevie.sunday} /></AccordionItem>
    </Accordion>
  );
}

// const dummy = { "for_week": 39, "menu": { "friday": { "dinner": { "clarity": "Pernil ( Contains Pork) , Arroz on Gandules , Roasted Br occoli Mushr oom Picadillo", "heritage": "", "lord_saunders": "CLOSED" }, "lunch": { "clarity": "Pork and Cabbage Stir Fry , Rice Braised Eggplant w/ Crispy Garlic Oil", "heritage": "CLOSED IN OBSERVANCE OF THE SABBATH", "lord_saunders": "" } }, "monday": { "dinner": { "clarity": "Brisket , Cole Slaw , Baked Beans Bang Bang Cauliflower Wing s , Mac aroni and \u201cCheese \u201d", "heritage": "", "lord_saunders": "Pork Griot Vegetarian / Tofu Guisado Sides Pikliz , Rice & Pigeon Peas" }, "lunch": { "clarity": "Turkey Moussaka , Saut\u00e9ed Kale Mushroom Bourguignon", "heritage": "Closed for Yom Kippur", "lord_saunders": "" } }, "saturday": { "dinner": { "clarity": "Buffalo Chicken Pizza Cheese Pizza , Roasted V egetable Pizza , Caesar Salad", "heritage": "", "lord_saunders": "CLOSED" }, "lunch": { "clarity": "Chipotle Lime Ch icken , Mashed Sweet Pot atoes Chia Chick pea Cakes , Roasted Vegetable Medley", "heritage": "", "lord_saunders": "" } }, "sunday": { "dinner": { "clarity": "Chicke n w/ Romesco Sauce , Roasted Tomatoes , Roasted Root Vegetable Smoked Lentils w/ Spicy Aioli and Fresh V egetables Lyonaise Potatoes", "heritage": "Chicken Marsala , Mushroom Risotto , Roasted Garlic Red Potatoes Tofu Marsala , Vegetable Medley", "lord_saunders": "Buttermilk Fried Chicken , Barbecue Roasted Chicken , Macaroni & Chees e Sides Candied Yams , Butter Braised Collard Greens , Cornbread" }, "lunch": { "clarity": "Breakfast Sweet Po tatoes w/ Pest o White Beans , Pork Sausage Chic kpea Quinoa Hash , Baked Chocolate Oatmeal w/ Mixed Berrie s", "heritage": "Brunch Scrambled Eggs , Pumpkin Bread Pudding , Hash browns , Turkey Bacon Brunch Tofu Scramble , Beyond Sausage , Shakshouka", "lord_saunders": "" } }, "thursday": { "dinner": { "clarity": "Birria Tacos , Stew ed Pinto Beans , Rice Black Bean Quesadillas", "heritage": "Poke Bowl Bar , Sushi Rice Poke Bowl Bar", "lord_saunders": "Chipotle Chicken Nachos Vegetarian / Corn, Bean, & Squash Nachos Sides Nacho Cheese Sauce , Refried Beans , Spanish Rice , Pico De Gallo" }, "lunch": { "clarity": "Chicken Fajitas Spanish Verde Quinoa Stuffed Peppers , Spanish Rice", "heritage": "Mongolian Beef , Chili Garlic Eggplant General Tso's Tofu , Jasmine Rice", "lord_saunders": "" } }, "tuesday": { "dinner": { "clarity": "Chicke n Paprikash w/ Dumplings , Broccoli Sweet Potato Black Bean Cake", "heritage": "Shredded Chicken Taco Bar , Refried Beans Seitan (Chorizo) Taco Bar , Cuban Yellow Rice", "lord_saunders": "Ghanaian Grilled Chicken Vegetarian / Egusi Stew Sides West African Chickpeas/Spinach , Jollof Rice" }, "lunch": { "clarity": "Beef Curry , Basmati Rice , Roasted Aloo Gobi Channa Masala Dal", "heritage": "Ancho Chili Beef Taco Bar , Mexican Rice Adobo Tofu Taco Bar , Stewed Black Beans", "lord_saunders": "" } }, "wednesday": { "dinner": { "clarity": "Beef Stew , Green Beans Eggplant Parme san", "heritage": "Cola Braised Beef Brisket , Herbed Orzo Ratatouille , Noodle Kugel , Steamed Peas", "lord_saunders": "Jamaican Beef Patties (Contains Pork) Vegetarian / Trini Chana Sides Fried Plantains , Calalloo Greens , Steamed White Rice" }, "lunch": { "clarity": "Stewed Andouille Grits , Buttered Peas Hoppi n John , Tomato Cucumber Salad", "heritage": "Turkey Tetrazzini , Pasta Marinara Spinach and Artichoke Stuffed Portobello Mushrooms , Green Bean Almondine", "lord_saunders": "" } } }, "stevie": { "friday": { "breakfast": { "BREAKFAST": "Bacon, Cinnamon Roll Pancakes, Oatmeal, Scrambled Eggs (Liquid Egg), Scrambled Tofu, Tater Tots, ", "DAILY FEATURES": "Southwest Vegetable Egg and Cheddar Turnover, Triple Berry Smoothie, " }, "dinner": { "BLUE FIN DINNER": "Green Pepper and Tomato Salad, Roasted Sweet Potato Wedges, Smoked Catfish, ", "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS DINNER": "Creamy Tomato Soup, Crinkle Cut French Fries, Grilled Cheese on Texas Toast, ", "NUTRI SPECIALTY SALADS DINNER": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "ROOTS DINNER": "Grilled Tofu Bruschetta, Orzo Olive Risotto, ", "SMOKE & FIRE DINNER": "Grilled Chicken Bruschetta with Balsamic Glaze, Pesto Orzo, ", "TRATTORIA DINNER": "Cheese Pizza, Penne Marinara, Smokehouse Chicken Pizza, Vegan Vegetable Lovers Pizza, " }, "lunch": { "BLUE FIN LUNCH": "Green Pepper and Tomato Salad, Roasted Sweet Potato Wedges, Smoked Catfish, ", "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS LUNCH": "Creamy Tomato Soup, Crinkle Cut French Fries, Grilled Cheese on Texas Toast, ", "NUTRI SPECIALTY SALADS LUNCH": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "ROOTS LUNCH": "Seasoned Yellow Rice, Tofu Gumbo, ", "SMOKE & FIRE LUNCH": "Nashville Hot Chicken Bowl, ", "TRATTORIA LUNCH": "Cheese Pizza, Penne Marinara, Smokehouse Chicken Pizza, Vegetable Lovers Pizza, " } }, "monday": { "breakfast": { "BREAKFAST": "Buttermilk Pancakes, Grilled Kielbasa, Home Fry Russet Potatoes, Oatmeal, Scrambled Eggs (Liquid Egg), Scrambled Tofu, ", "DAILY FEATURES": "Mushroom and Sweet Potato Quiche, Smoothie Bowl, " }, "dinner": { "BLUE FIN DINNER": "Classic Southern Style Shrimp and Grits, ", "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS DINNER": "Chicken Noodle Soup, Hand Cut BBQ Spiced Jojos, Texas Backyard BBQ Smash Burger, ", "NUTRI SPECIALTY SALADS DINNER": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "ROOTS DINNER": "Sauteed Vegetable Medley, Smoky Beans and Greens in Tomato Broth, ", "SMOKE & FIRE DINNER": "Chicken and Rice Casserole, Sauteed Vegetable Medley, ", "TRATTORIA DINNER": "Cheese Pizza, Margherita Pizza, Penne Marinara, Pepperoni Pizza, " }, "lunch": { "BLUE FIN LUNCH": "Classic Southern Style Shrimp and Grits, ", "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS LUNCH": "Chicken Noodle Soup, Hand Cut BBQ Spiced Jojos, Texas Backyard BBQ Smash Burger, ", "NUTRI SPECIALTY SALADS LUNCH": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "ROOTS LUNCH": "Cajun Seared Tofu with Pineapple Salsa, Classic Rice Pilaf, ", "SMOKE & FIRE LUNCH": "MTO Chimichurri Chicken Stir Fry Bar, ", "TRATTORIA LUNCH": "Cheese Pizza, Margherita Pizza, Penne Marinara, Pepperoni Pizza, " } }, "saturday": { "breakfast": { "BREAKFAST": "Chocolate Chip Buttermilk Pancakes, Home Fry Russet Potatoes, Oatmeal, Pork Sausage Patty, Scrambled Eggs (Liquid Egg), Vegetarian Sausage Patty, ", "DAILY FEATURES": "MTO Omelet Bar, " }, "dinner": { "BLUE FIN DINNER": "Lemon Garlic Green Beans, Seared Salmon Cakes, ", "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS DINNER": "Bacon Jalapeno Cheese Dog, Cream of Potato Soup Low Sodium, Spicy Fries, ", "NUTRI SPECIALTY SALADS DINNER": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "ROOTS DINNER": "Black Pepper Tofu with Bok Choy, Vegetarian Stir Fried Rice Side, ", "SMOKE & FIRE DINNER": "MTO Pierogi Bar, ", "TRATTORIA DINNER": "Cheese Pizza, Penne Marinara, Sausage Pizza, Taco Pizza, " }, "lunch": { "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS LUNCH": "Bacon Jalapeno Cheese Dog, Cream of Potato Soup Low Sodium, Spicy Fries, ", "NUTRI SPECIALTY SALADS LUNCH": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "OMELET MTO BAR": "MTO Omelet Bar, ", "ROOTS LUNCH": "Chocolate Chip Buttermilk Pancakes, Oatmeal, Vegetarian Sausage Patty, ", "SMOKE & FIRE LUNCH": "Home Fry Russet Potatoes, Pork Sausage Patty, Scrambled Eggs (Liquid Egg), ", "TRATTORIA LUNCH": "Cheese Pizza, Penne Marinara, Sausage Pizza, Taco Pizza, " } }, "sunday": { "breakfast": { "BREAKFAST": "Hash Browns, Oatmeal, Roasted Grape Tomatoes, Scrambled Eggs (Liquid Egg), Scrambled Tofu, Turkey Sausage Link, " }, "dinner": { "BLUE FIN DINNER": "Platinum Standard Macaroni and Cheese, Smoky Greens, Southern Fried Cod Fish, ", "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS DINNER": "Beef Philly Sandwich, Crinkle Cut French Fries, Tuscan Minestrone Soup, ", "NUTRI SPECIALTY SALADS DINNER": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "ROOTS DINNER": "Ratatouille and Herb Risotto Cake, ", "SMOKE & FIRE DINNER": "Garlic Mashed Potatoes, Rotisserie Turkey Breast with Sage Gravy*, Southern Style Green Beans, ", "TRATTORIA DINNER": "Cheese Pizza, Penne Marinara, Pepperoni Pizza, Smoked Gouda and Ham Pizza, " }, "lunch": { "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS LUNCH": "Beef Philly Sandwich, Crinkle Cut French Fries, Tuscan Minestrone Soup, ", "NUTRI SPECIALTY SALADS LUNCH": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "ROOTS LUNCH": "Oatmeal, Roasted Grape Tomatoes, Scrambled Tofu, ", "SMOKE & FIRE LUNCH": "Hash Browns, Scrambled Eggs (Liquid Egg), Turkey Sausage Link, ", "TRATTORIA LUNCH": "Cheese Pizza, Penne Marinara, Pepperoni Pizza, Smoked Gouda and Ham Pizza, " } }, "thursday": { "breakfast": { "BREAKFAST": "Cinnamon French Toast Sticks, Lyonaise Potatoes, Oatmeal, Scrambled Eggs (Liquid Egg), Turkey Sausage Patty, Vegetarian Sausage Patty, ", "DAILY FEATURES": "MTO Omelet Bar, Spinach Tomato Basil Ricotta Quiche, " }, "dinner": { "BLUE FIN DINNER": "Brazilian Fish Stew, Cilantro Lime Brown Rice, ", "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS DINNER": "Beef Chili, Garlic Parmesan Frites, Italian Sausage Sandwich with Marinara, ", "NUTRI SPECIALTY SALADS DINNER": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "ROOTS DINNER": "Mediterranean Quinoa Primavera, Vegan Seitan Stew, ", "SMOKE & FIRE DINNER": "Open Faced Roast Beef over Texas Toast, Sauteed Zucchini, ", "TRATTORIA DINNER": "Cheese Pizza, Penne Marinara, Pepperoni Pizza, Spicy White Pizza, " }, "lunch": { "BLUE FIN LUNCH": "Brazilian Fish Stew, Cilantro Lime Brown Rice, ", "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS LUNCH": "Beef Chili, Garlic Parmesan Frites, Italian Sausage Sandwich with Marinara, ", "NUTRI SPECIALTY SALADS LUNCH": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "ROOTS LUNCH": "Broccoli Vegetable Medley, Portabella Cheese Steak Sandwich, ", "SMOKE & FIRE LUNCH": "Broccoli Vegetable Medley, Philly Cheesesteak Macaroni and Cheese, ", "TRATTORIA LUNCH": "Cheese Pizza, Penne Marinara, Pepperoni Pizza, Spicy White Pizza, " } }, "tuesday": { "breakfast": { "BREAKFAST": "French Toast, Hash Browns, Oatmeal, Scrambled Eggs (Liquid Egg), Turkey Sausage Link, Vegetarian Sausage Patty, ", "DAILY FEATURES": "Leek and Roasted Red Pepper Quiche, MTO Omelet Bar, " }, "dinner": { "BLUE FIN DINNER": "Baja Fish Tacos, Pico De Gallo, Spanish Rice, ", "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS DINNER": "Beef and Vegetable Soup, Grilled Pickle Brine Chicken Sandwich, Old Bay French Fries, ", "NUTRI SPECIALTY SALADS DINNER": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "ROOTS DINNER": "Vegetarian Nacho Tater Tots, ", "SMOKE & FIRE DINNER": "MTO BBQ Pulled Pork Nacho Bar, ", "TRATTORIA DINNER": "Cheese Pizza, Penne Marinara, Philly Beef Pizza, Vegan Vegetable Lovers Pizza, " }, "lunch": { "BLUE FIN LUNCH": "Baja Fish Tacos, Pico De Gallo, Spanish Rice, ", "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS LUNCH": "Beef and Vegetable Soup, Grilled Pickle Brine Chicken Sandwich, Old Bay French Fries, ", "NUTRI SPECIALTY SALADS LUNCH": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "ROOTS LUNCH": "Cauliflower Vegetable Medley, Pico De Gallo, Roasted Mushroom Adobo Taco, Spanish Rice, ", "SMOKE & FIRE LUNCH": "Beef Taco Bowl, ", "TRATTORIA LUNCH": "Cheese Pizza, Penne Marinara, Philly Beef Pizza, Vegetable Lovers Pizza, " } }, "wednesday": { "breakfast": { "BREAKFAST": "Blueberry Buttermilk Pancakes, Oatmeal, Pork Sausage Patty, Potato Tater Triangles, Scrambled Eggs (Liquid Egg), Scrambled Tofu, ", "DAILY FEATURES": "Bananas Foster French Toast, MTO Omelet Bar, " }, "dinner": { "BLUE FIN DINNER": "Miso Broiled Salmon, Sesame Broccoli, Steamed Short Grain Rice, ", "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS DINNER": "BBQ Jackfruit Sandwich, Broccoli and Cheddar Soup, Crinkle Cut French Fries, ", "NUTRI SPECIALTY SALADS DINNER": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "ROOTS DINNER": "Egg Roll Bowl, ", "SMOKE & FIRE DINNER": "Eggplant with Garlic Sauce, Miso Roasted Chicken, Vegetarian Stir Fried Rice Side, ", "TRATTORIA DINNER": "Cheese Pizza, Mushroom and Grilled Onion Pizza, Penne Marinara, Sausage Pizza, " }, "lunch": { "BLUE FIN LUNCH": "Miso Broiled Salmon, Sesame Broccoli, Steamed Short Grain Rice, ", "DELI": "MTO Deli Bar, ", "GRILL & SPECIALS LUNCH": "BBQ Jackfruit Sandwich, Broccoli and Cheddar Soup, Crinkle Cut French Fries, ", "NUTRI SPECIALTY SALADS LUNCH": "Arugula Tomato Salad, Citrus Spiced Lentil Salad, Hummus Allergen Free, Marinated Roasted Beet Salad, ", "NUTRIBAR": "MTO Salad Bar, ", "ROOTS LUNCH": "Sesame Broccoli, Sesame Crusted Tofu, Steamed Short Grain Rice, ", "SMOKE & FIRE LUNCH": "Sesame Broccoli, Steamed Short Grain Rice, Sweet and Spicy Sambal Pork Noodles, ", "TRATTORIA LUNCH": "Cheese Pizza, Mushroom and Grilled Onion Pizza, Penne Marinara, Sausage Pizza, " } } } }

export default function Index() {
  "use client";
  const [menu, setMenu] = useState(null as MenuResponse | null);
  // const menu = dummy satisfies MenuResponse;
  
  useEffect(() => {
      fetch("https://www.austinrockwell.net/api/menus").then(x => {
        x.json().then(x => setMenu(x));
      });

  }, []);
  if (menu === null) {
    return <>Loading Menus...</>;
  }
  const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][(new Date()).getDay()];
  return <><AccordionAlwaysOpen menu={menu.menu} currentDay={week} stevie={menu.stevie} />For Week: {menu.for_week}<div className="italic">*DISCLAIMER: Some menu options may not be accurate.  If any issue arises (either with using the site or incorrect menus), please contact arockwel@oberlin.edu </div></>
}
