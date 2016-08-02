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
  function(mat,
           preserve_order=T,
           use_viewer=F,
           display_rownames=T,
           display_colnames=T,
           pixel_width=4,
           pixel_height=4) {
  col_mapper <- col_numeric(c('#132B43', '#56B1F7'), c(min(mat), max(mat)))
  
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
  
  sizing_policy <- sizingPolicy(padding=0, browser.fill=T, viewer.suppress=!use_viewer)
  
  msg <- list()
  msg$base64 <- heatmap_64
  msg$rownames <- rownames(mat)
  msg$colnames <- colnames(mat)
  msg$nrow <- nrow(mat)
  msg$ncol <- ncol(mat)
  msg$display_rownames <- display_rownames
  msg$display_colnames <- display_colnames
  msg$pixel_width <- pixel_width
  msg$pixel_height <- pixel_height
  
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
