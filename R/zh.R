cubehelix <- function (start = 0.5, r = -1.5, hue = 1, gamma = 1) {
  M <- matrix(c(-0.14861, -0.29227, 1.97294, 1.78277, -0.90649, 0), ncol = 2)
  return(function(lambda){
    l   <- rep(lambda^gamma, each = 3)
    phi <- 2 * pi * (start/3 + r * lambda)
    t   <- rbind(cos(phi), sin(phi))
    out <- l + hue * l * (1 - l)/2 * (M %*% t)
    out <- pmin(pmax(out, 0), 1)
    out <- apply(out, 2, function(x) rgb(x[1], x[2], x[3]))
    return(out)
  })
}

#' ZH: Fast heatmap plotter as an HTML widget
#'
#' @import htmlwidgets
#' @import png
#' @import grDevices
#' @import RCurl
#' @import xml2
#' @import scales
#' @import dplyr
#' @import reshape2
#' @import tidyr
#' @import tibble
#' @import magrittr
#' @import purrr
#'
#' @export



#library( htmlwidgets )
#library( png )
#library( grDevices )
#library( RCurl )
#library( scales )
#library( dplyr )
#library( reshape2 )
#library( tidyr )
#library( tibble )
#library( magrittr )
#library( xml2 )
#library( purrr )

# asdfasf -----------------------------------------------------------------

zh <-
  function(
    mat,
    preserve_order            = T,
    use_viewer                = F,
    display_rownames          = T,
    display_colnames          = T,
    label_margin              = 10,
    pixel_width_with_no_text  = 4,
    pixel_height_with_no_text = 4,
    pixel_width_with_text     = 15,
    pixel_height_with_text    = 15
    )
  {
    col_mapper <- col_numeric(c('#132B43', '#56B1F7'), c(min(mat), max(mat)))
    # col_mapper <- . %>% rescale %>% {Vectorize(cubehelix())(.)}

    d_names_list <- dimnames(mat)
    d_names <- names(d_names_list)
    row_names <- d_names_list[[1]]
    col_names <- d_names_list[[2]]
    
    heatmap_64 <- mat %>%
      col_mapper %>%
      col2rgb %>%
      divide_by(255) %>%
      array(c(3, nrow(mat), ncol(mat))) %>%
      aperm(c(2,3,1)) %>%
      writePNG %>%
      base64Encode %>%
      sprintf('data:image/png;base64,%s', .)
    
    pixel_width <- ifelse(display_rownames, pixel_width_with_text, pixel_width_with_no_text)
    pixel_height <- ifelse(display_rownames, pixel_height_with_text, pixel_height_with_no_text)

    svg <- read_xml('<svg id="zh-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" />')
    img <- read_xml('<image />')
    xml_attr(img, 'id') <- 'zh-heatmap'
    xml_attr(img, 'href') <- heatmap_64
    xml_attr(img, 'height') <- (nrow(mat) * pixel_height) %>% as.character
    xml_attr(img, 'width') <- (ncol(mat) * pixel_width) %>% as.character
    xml_attr(img, 'x') <- 0 %>% as.character
    xml_attr(img, 'y') <- 0 %>% as.character
    xml_attr(img, 'preserveAspectRatio') <- 'none'
    xml_attr(img, 'image-rendering') <- 'pixelated'
    xml_add_child(svg, img)

    rownames <- rownames(mat)
    colnames <- colnames(mat)
    nrow <- nrow(mat)
    ncol <- ncol(mat)

    g_rownames <- read_xml('<g />')
    if (display_rownames && !is.null(rownames)) {
      for (i in 1:length(rownames)) {
        text <- read_xml('<text />')
        xml_attr(text, 'x') <- (- label_margin) %>% as.character
        xml_attr(text, 'y') <- ((i - 1 + 0.5) * pixel_height_with_text) %>% as.character
        xml_attr(text, 'class') <- 'zh-label'
        xml_text(text) <- rownames[i]
        xml_add_child(g_rownames, text)
      }
    }
    xml_add_child(svg, g_rownames)

    g_colnames <- read_xml('<g class="zh-rotate" />')
    if (display_colnames && !is.null(colnames)) {
      for (i in 1:length(colnames)) {
        text <- read_xml('<text />')
        xml_attr(text, 'x') <- (- label_margin) %>% as.character
        xml_attr(text, 'y') <- (-(i - 1 + 0.5) * pixel_width_with_text) %>% as.character
        xml_attr(text, 'class') <- 'zh-label'
        xml_text(text) <- colnames[i]
        xml_add_child(g_colnames, text)
      }
    }
    xml_add_child(svg, g_colnames)

    
    msg <- list()
    msg$svg <- svg %>% as.character
    msg$rownames <- rownames(mat)
    msg$colnames <- colnames(mat)
    msg$nrow <- nrow(mat)
    msg$ncol <- ncol(mat)
    #msg$display_rownames <- display_rownames
    #msg$display_colnames <- display_colnames
    msg$pixel_width <- pixel_width
    msg$pixel_height <- pixel_height
    
    sizing_policy <- sizingPolicy(padding=0, browser.fill=T, viewer.suppress=!use_viewer)
    createWidget('zh', msg, sizingPolicy=sizing_policy)
  }

# asdfasdf ----------------------------------------------------------------


#' Shiny bindings for zh
#'
#' Output and render functions for using zh within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a zh
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name zh-shiny
#'
#' @export
zhOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'zh', width, height, package = 'zh')
}

#' @rdname zh-shiny
#' @export
renderZh <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, zhOutput, env, quoted = TRUE)
}
