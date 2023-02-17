export class HtmlBuilder {

  private html = '';

  append(content: string): HtmlBuilder {
    this.html += content;
    return this;
  }

  openDiv(divClass: string): HtmlBuilder {
    return this.append("<div")
      .addClass(divClass)
      .append(">");
  }

  closeDiv(): HtmlBuilder {
    return this.append("</div>");
  }

  openUl(ulClass: string): HtmlBuilder {
    return this.append(`<ul class="${ulClass}">`);
  }

  closeUl(): HtmlBuilder {
    return this.append('</ul>');
  }

  addLi(liContent: string): HtmlBuilder {
    return this.append(`<li>${liContent}</li>`);
  }

  addLink(title: string, linkClass: string, href: string, content = ''): HtmlBuilder {
    return this.append("<a")
      .addTitle(title)
      .addClass(linkClass)
      .addHref(href)
      .append(">")
      .addContent(content)
      .append("</a>");
  }

  addP(content: string, classes: string): HtmlBuilder {
    return this.append('<p')
      .addClass(classes)
      .append('>')
      .append(content)
      .append('</p>');
  }

  addCopyResourceLinkButton(uri: string, classes = ''): HtmlBuilder {
    return this.append("<copy-resource-link-button")
      .addClass(`resource-copy-link ${classes}`)
      .addUri(uri)
      .append("></copy-resource-link-button>");
  }

  addUri(uri: string): HtmlBuilder {
    if (uri) {
      this.append(` uri="${uri}"`);
    }
    return this;
  }

  addContent(content = ''): HtmlBuilder {
    return this.append(content);
  }

  addTitle(title: string): HtmlBuilder {
    if (title) {
      this.append(` title="${title}"`);
    }
    return this;
  }

  addClass(classes: string): HtmlBuilder {
    if (classes) {
      this.append(` class="${classes}"`);
    }
    return this;
  }

  addHref(href: string): HtmlBuilder {
    if (href) {
      this.append(` href="${href}"`);
    }
    return this;
  }

  build(): string {
    return this.html;
  }
}
