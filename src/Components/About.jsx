import React from "react";

const About = () => {
  return (
    <main>
      <section className="wrapper gap-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-light-200">
            About us
          </p>
          <h1>Movies made easier to discover.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-light-200 sm:text-lg">
            We built this movie app to help film lovers quickly explore titles,
            find something worth watching, and keep the experience simple,
            fast, and enjoyable. Whether you are checking trending picks or
            looking for your next weekend watch, our goal is to make discovery
            feel effortless.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-lg border border-light-100/10 bg-dark-100 p-6 shadow-inner shadow-light-100/10 sm:p-8">
            <h2>What we care about</h2>
            <p className="mt-4 leading-7 text-light-200">
              Our focus is clean browsing, useful movie details, and a design
              that stays out of your way. We are always improving the app with
              better search, smoother navigation, and helpful content for every
              kind of movie fan.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-3xl font-bold text-white">Fast</p>
                <p className="mt-2 text-sm text-gray-100">
                  Quick results and simple screens.
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">Fresh</p>
                <p className="mt-2 text-sm text-gray-100">
                  Trending movies and new ideas.
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">Helpful</p>
                <p className="mt-2 text-sm text-gray-100">
                  Built around real viewer needs.
                </p>
              </div>
            </div>
          </div>

          <form className="rounded-lg border border-light-100/10 bg-light-100/5 p-6 shadow-inner shadow-light-100/10 sm:p-8">
            <h2>Contact us</h2>
            <p className="mt-3 text-sm leading-6 text-light-200">
              Have feedback, a movie suggestion, or a question? Send us a
              message and we will get back to you.
            </p>

            <div className="mt-6 grid gap-5">
              <label className="grid gap-2 text-sm font-medium text-white">
                Name
                <input
                  className="rounded-lg border border-light-100/10 bg-primary px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-white">
                Email
                <input
                  className="rounded-lg border border-light-100/10 bg-primary px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-white">
                Message
                <textarea
                  className="min-h-32 resize-y rounded-lg border border-light-100/10 bg-primary px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                  name="message"
                  placeholder="Write your message"
                />
              </label>

              <button
                className="rounded-lg bg-white px-5 py-3 font-semibold text-primary transition hover:bg-light-100"
                type="submit"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default About;
