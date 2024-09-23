# brutalist-report-css
JS Bookmarklet for The Brutalist Report.

This adds a menu to the page for sorting and filtering the displayed news sources with custom css. Make selections, generate and live test your css, then save your custom css stylesheet for applying via your preferred stylesheet manager such as Stylus [0].

[0] [https://addons.mozilla.org/en-US/firefox/addon/styl-us/](https://addons.mozilla.org/en-US/firefox/addon/styl-us/)

# Why did we make this
[https://brutalist.report](https://brutalist.report) is a nice site. The creators describe it as "A rolling snapshot of the day's headlines presented in a fast and simple yet information dense view" and also as "The day's headlines delivered to you without bullshit." What a great vision!

The thing is, though, not everybody wants to see every single one of the 57 or so sources listed there. Maybe you don't care for politics, or maybe you don't care for sports, or maybe you care about technology but not the tech industry. Maybe you think a source is not trusted enough, or maybe the source is actually mostly just product advertisements. Maybe you just want a custom selecton because you only need one or two sources from each category.

When you add all that up, it's actually quite a lot of bullshit still, probably. It would be great if we could have our day's headlines without all that!

It seems that the website creators have also had this idea, as they mention it on their page describing the perks of premium membership [0]:
> Ability to view articles on main page, including filtering/sorting

It indicates that filtering and sorting is available with no plan, but I don't see controls for it anywhere on the front page. There is the ability to select a single category, which is something. Is sorting and filtering available with a free plan? Let me know if you know the answer already but I see no need to sign up just to find out. Not anymore, anyway, because this bookmarklet lets us do both!

[1] [https://brutalist.report/premium](https://brutalist.report/premium)

# Basic technical function
At the most basic level, this is a Javascript Bookmarklet. A JS Bookmarklet is a little bit of code that you activate by clicking on it like a link. It typically resides in your bookmarks toolbar and you can click it to perform the custom function. The code is run on the page that you are on in your browser. Being Javascript this can be very powerful and make significant changes to the page or sometimes pull in info from elsewhere. It can expose obscured parts of loaded content or process it for download or, as in this case, we are adding interface elements to the page for a custom menu, and hiding and rearranging other elements by applying new css stylesheets to the page.

# What else are we doing
This bookmarklet actually doesnt do the work of applying the stylesheet just by clicking on it. Instead, it generates a menu that allows you to select which news feeds on the page you'd like to show or hide and also drag-and-drop them around on two lists to determine the order they should appear on the page. Then you can either apply the css directly to the current page or you can print the css in a code block and copy it to your clipboard.

From there you can use the css in a custom stylesheet in Stylus and your preferred sources will display in your preferred order every time you visit.

# What technologies does this use
Javascript bookmarklets have been around since Javascript was invented in 1995. The history of Bookmarklets is a bit interesting even if they are not much used these days [2]. I like them because they're simple, portable and shareable, they give users direct and immediate control over the page in front of them, and they're powerful.

It's notable that some of the css involved here was only adopted by browsers more recently. In particular the pseudo-class `:has` in 2023 [3], and the `order` property in 2015 [4].

[2] Better Living Through Bookmarklets - Simon Willison - Apr 9, 2004 - [https://web.archive.org/web/20111225052201/http://www.sitepoint.com/bookmarklets/](https://web.archive.org/web/20111225052201/http://www.sitepoint.com/bookmarklets/)

[3] [https://developer.mozilla.org/en-US/docs/Web/CSS/:has](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)

[4] [https://developer.mozilla.org/en-US/docs/Web/CSS/order](https://developer.mozilla.org/en-US/docs/Web/CSS/order)

# Basic operation
1. Load the Brutalist page
2. Click the bookmarklet
3. Scroll to the bottom of the page where our controls have been added
4. Sort the list on the left, and move unwanted sources to the second list.
- The css is generated from the list on the left.
- The `Select all` button moves all sources to the left list, and the `Deselect all` button moves all sources to the right list.
- You can move sources around on the list, or between lists by dragging and dropping them. You can also move an item to the other list just by clicking it.
5. Generate, apply, and save your custom css
- The `Generate` button will create a code block at the bottom of the page with the css, and a new button to copy it to clipboard.
- The `Apply` button will apply the current list to the page immediately so you can see how your filtered and sorted page will look.

# License
This project uses GPL3 license, see license file
